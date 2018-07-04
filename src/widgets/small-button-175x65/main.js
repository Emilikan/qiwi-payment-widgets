import Widget from '../../modules/widget';
import redirection from '../../modules/redirection';

import PaymentIcons from '../../components/PaymentIcons';
import Button from '../../components/Button';

import './css/styles.css';

const widgetPaymentIcons = PaymentIcons();
const widgetButton = Button();

const elements = [widgetButton, widgetPaymentIcons];
const isTransparent = true;

const smallButton175x65 = new Widget(elements, isTransparent);

smallButton175x65.init();
