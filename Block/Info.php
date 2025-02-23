<?php

namespace Devgfnl\WidgetBlockPageBuilder\Block;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;

class Info extends Template implements BlockInterface
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
