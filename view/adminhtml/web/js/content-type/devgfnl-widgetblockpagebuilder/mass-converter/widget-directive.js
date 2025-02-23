define([
    'Magento_PageBuilder/js/mass-converter/widget-directive-abstract',
    'Magento_PageBuilder/js/utils/object'
], function (widgetDirective, dataObject) {
    'use strict';

    class WidgetDirective extends widgetDirective {
        /**
         * Convert value to internal format
         *
         * @param {object} data
         * @param {object} config
         * @returns {object}
         */
        fromDom(data, config) {
            var attributes = super.fromDom(data, config);

            return data;
        }

        toDom(data, config) {
            const attributes = {
                type: 'Devgfnl\\WidgetBlockPageBuilder\\Block\\Info',
                template: 'Devgfnl_WidgetBlockPageBuilder::info.phtml',
                type_name: 'Widget with PageBuilder',
                my_field: data.my_field
                // ... other attributes to be passed to the block
            };

            dataObject.set(data, config.html_variable, this.buildDirective(attributes));
            return data;
        }
    }

    return WidgetDirective;
});
