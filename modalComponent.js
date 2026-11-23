import { api, LightningElement } from 'lwc';

export default class ModalComponent extends LightningElement {

    closeModal () {
        this.dispatchEvent(new CustomEvent('hide'));
    }
}