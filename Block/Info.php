<?php

namespace Devgfnl\WidgetBlockPageBuilder\Block;

use Magento\Framework\View\Element\Template;

class Info extends Template
{
    /**
     * Get my field from Page Builder
     *
     * @return string
     */
    public function getMyField(): string
    {
        return $this->getData('my_field');
    }
}
