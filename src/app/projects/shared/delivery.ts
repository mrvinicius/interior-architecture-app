import { DeliveryDescription } from './delivery-description.enum';
import { TimeUnity } from '../../shared/time-unity.enum';

export class Delivery {
    deliveryDescription?: DeliveryDescription;
    duration: number;
    durationTimeUnity: TimeUnity;
}