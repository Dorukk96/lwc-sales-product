import { api, LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ProductList extends LightningElement {

    @track products = [];
    @api recordId;
    isModalActive = false;
    selectedLineItem;
    @api currencyCode = '';

    cols = [
        { label: 'Name', fieldName: 'Name', type: 'link' }, 
        { label: 'Unit Price', fieldName: 'UnitPrice', type: 'currency' },
        { label: 'Quantity', fieldName: 'Quantity' },
        { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency' }
    ];

    get grantTotal () {
        let sum = 0;
        this.products.forEach(product => {
            sum += product?.TotalPrice;
        });

        let currFormat = new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: this.currencyCode
        });

        return currFormat.format(sum);
    }

    /**
     * Lists all the line items down under a certain opportunity record
     */
    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId : 'OpportunityLineItems', 
        fields: ['OpportunityLineItem.Product2.Name', 'OpportunityLineItem.UnitPrice', 'OpportunityLineItem.Quantity', 'OpportunityLineItem.TotalPrice']
    }) wiredLineItems ({ data, error }) {
        if (data) {
            if (data.records.length > 0) {
                console.log('>>> ', data.records);
                this.displayToastMessage('Success', 'Products loaded', 'success');
                this.products = data.records.map(product => {
                    return {
                        Name            : product.fields?.Product2?.displayValue,
                        UnitPrice       : product.fields?.UnitPrice?.value,
                        Quantity        : product.fields?.Quantity?.value,
                        TotalPrice      : product.fields?.TotalPrice.value
                    };
                });
            } else {
                this.products = undefined;
            }
        } else if (error) {
            this.displayToastMessage('Error', error, 'error');
        }
    
    }

    displayToastMessage (title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }

    displayModalHandler (event) {
        this.selectedLineItem = event.detail.selectedRows[0]; // {"Name":"SLA: Gold","UnitPrice":30000,"Quantity":2,"TotalPrice":60000}
        this.isModalActive = true;
    }

    closeModal () {
        this.isModalActive = false;
        this.selectedLineItem = undefined;
    }
}