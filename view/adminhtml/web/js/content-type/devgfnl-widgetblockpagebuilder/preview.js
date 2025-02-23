define([
    'jquery',
    'mage/translate',
    'knockout',
    'underscore',
    'Magento_PageBuilder/js/config',
    'Magento_PageBuilder/js/content-type/preview'
], function (
    $,
    $t,
    ko,
    _,
    Config,
    PreviewBase
) {
    'use strict';

    var $super;

    /**
     * Quote content type preview class
     *
     * @param parent
     * @param config
     * @param stageId
     * @constructor
     */
    function Preview(parent, config, stageId) {
        PreviewBase.call(this, parent, config, stageId);
        this.displayPreview = ko.observable(false);
        this.previewElement = $.Deferred();
        this.loading = ko.observable(false);
        this.widgetUnsanitizedHtml = ko.observable();
        this.element = null;
        this.messages = {
            EMPTY: $t('Empty...'),
            NO_RESULTS: $t('No result were found.'),
            LOADING: $t('Loading...'),
            UNKNOWN_ERROR: $t('An unknown error occurred. Please try again.')
        };
        this.placeholderText = ko.observable(this.messages.EMPTY);
    }

    Preview.prototype = Object.create(PreviewBase.prototype);
    $super = PreviewBase.prototype;

    /**
     * Modify the options returned by the content type
     *
     * @returns {*}
     */
    Preview.prototype.retrieveOptions = function () {
        var options = $super.retrieveOptions.call(this, arguments);

        // Customize options here

        return options;
    };

    /**
     * On afterRender callback.
     *
     * @param {Element} element
     */
    Preview.prototype.onAfterRender = function (element) {
        this.element = element;
        this.previewElement.resolve(element);
    };

    /**
     * @inheritdoc
     */
    Preview.prototype.afterObservablesUpdated = function () {
        $super.afterObservablesUpdated.call(this);
        const data = this.contentType.dataStore.getState();

        if (this.hasDataChanged(this.previousData, data)) {
            this.displayPreview(false);

            if (!this.shouldDisplay(data)) {
                this.placeholderText(this.messages.EMPTY);
                return;
            }

            const url = Config.getConfig('preview_url'),
                requestConfig = {
                    // Prevent caching
                    method: 'POST',
                    data: {
                        role: this.config.name,
                        directive: this.data.main.html()
                    }
                };

            this.placeholderText(this.messages.LOADING);

            $.ajax(url, requestConfig)
                .done((response) => {
                    console.log('response', response);
                    if (typeof response.data !== 'object' || !response.data.content) {
                        this.placeholderText(this.messages.NO_RESULTS);

                        return;
                    }

                    if (response.data.error) {
                        this.widgetUnsanitizedHtml(response.data.error);
                    } else {
                        this.widgetUnsanitizedHtml(response.data.content);
                        this.displayPreview(true);
                    }

                    this.previewElement.done(() => {
                        $(this.element).trigger('contentUpdated');
                    });
                })
                .fail(() => {
                    this.placeholderText(this.messages.UNKNOWN_ERROR);
                });
        }
        this.previousData = Object.assign({}, data);
    };

    /**
     * Determine if the preview should be displayed
     *
     * @param data
     * @returns {boolean}
     */
    Preview.prototype.shouldDisplay = function (data) {
        const myField = data.my_field;

        return !!myField;
    };

    /**
     * Determine if the data has changed, whilst ignoring certain keys which don't require a rebuild
     *
     * @param {object} previousData
     * @param {object} newData
     * @returns {boolean}
     */
    Preview.prototype.hasDataChanged = function (previousData, newData) {
        previousData = _.omit(previousData, this.ignoredKeysForBuild);
        newData = _.omit(newData, this.ignoredKeysForBuild);
        return !_.isEqual(previousData, newData);
    };

    return Preview;
});
