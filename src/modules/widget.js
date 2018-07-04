import {getAlias, getPublicKey} from './parsers';
import {getMerchantInfoByAlias, getMerchantInfoByKey} from './api';
import WidgetComponent from '../components/Widget';
import {styleCode, stylesArrayToObject} from './helpers';

export default class Widget {
    constructor(elements, isTransparent = false) {
        this._render(elements);
        this.alias = getAlias();
        this.isTransparent = isTransparent;
        this.publicKey = getPublicKey();
    }

    async init() {
        let data = {};

        try {
            if (this.alias) {
                data = await getMerchantInfoByAlias(this.alias);
                // у кнопки может быть задано несколько текстов от мерчанта
                // непонятно зачем, везде использовался 0, поэтому переопределяем
                // в точке входа данных
                data.merchant_button_text = data.merchant_button_text[0];
                data.merchant_styles = stylesArrayToObject(data.merchant_styles);
            } else if (this.publicKey) {
                data = await getMerchantInfoByKey(this.publicKey);
                // у кнопки может быть задано несколько текстов от мерчанта
                // непонятно зачем, везде использовался 0, поэтому переопределяем
                // в точке входа данных
                data.merchant_button_text = data.merchant_button_text[0];
                data.merchant_styles = stylesArrayToObject(data.merchant_styles);
            } else {
                throw new Error('No public key or alias in url');
            }

            this._changeTabTitle(data.merchant_name);
            this._addMetricCounter(data.merchant_metric);
            if (this.isTransparent) {
                console.log(data.merchant_styles[styleCode.WIDGET_BACKGROUND]);
                delete data.merchant_styles[styleCode.WIDGET_BACKGROUND];
                console.log(data.merchant_styles[styleCode.WIDGET_BACKGROUND]);
            }
            this._addBackground(data.merchant_styles[styleCode.WIDGET_BACKGROUND]);
            this.widget.init(data);
        } catch (err) {
            this.widget.dispose();
            console.warn('Widget is disabled by: ', err.message);
        }

        this._endLoading();
    }

    _addMetricCounter = (counter) => {
        if (!counter) {
            return false;
        }

        try {
            const yaCounter = `yaCounter${counter}`;
            window[yaCounter] = new window.Ya.Metrika({
                id: counter,
                clickmap: true,
                trackLinks: true,
                accurateTrackBounce: true
            });

            this._createYandexNoScript(counter);
        } catch (e) {
        }
    };

    _createYandexNoScript = (counter) => {
        const container = document.createElement('noscript');

        container.innerHTML = `<div>
            <img src="https://mc.yandex.ru/watch/${counter}" style="position:absolute; left:-9999px;" alt="" />
        </div>`;

        document.body.appendChild(container);
    };

    _changeTabTitle(title) {
        document.title = title;
    }

    _addBackground(color) {
        if (color) {
            this.widget.element.style.backgroundColor = color;
        }
    }

    _render(elements) {
        this.widget = new WidgetComponent(elements);
        document.body.appendChild(this.widget.element);
    }

    _endLoading() {
        document.querySelector('#loader').style.display = 'none';

        this.widget.show();
    }
}
