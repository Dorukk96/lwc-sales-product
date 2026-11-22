import { api, LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

export default class ProductList extends LightningElement {

    @track products = [];
    @track productData = [];
    @api recordId;
    @track opportunity = {};

    cols = [
        { label: 'Name', fieldName: 'Name' }, 
        { label: 'Total Price', fieldName: 'TotalPrice', type: 'currency' },
        { label: 'Quantity', fieldName: 'Quantity' },
    ]

    /**
     * Fetches the opportunity details and sets them on the component for display in the template.
     * Takes record ID and fields to be displayed on the card.
     */
    @wire(getRecord, { recordId: '$recordId', fields: [
        'Opportunity.Name', 
        'Opportunity.Amount', 
        'Opportunity.StageName', 
        'Opportunity.Account.Name'
    ] })
    wiredOpportunityRecord ({ data, error }) {
        if (data) {
            this.opportunity['name']     = data.fields.Name.value.toUpperCase();
            this.opportunity['amount']   = data.fields.Amount.value;
            this.opportunity['stage']    = data.fields.StageName.value;
            this.opportunity['accName']  = data.fields.Account.displayValue;

            if (this.opportunity) {
                this.displayToastMessage('Success', 'Opportunity loaded', 'success');
            }
        } else if (error) {
            this.displayToastMessage('Error', `Unable to fetch Opportunity details: ${error}`, 'error');
        }
    }

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId : 'OpportunityLineItems', 
        fields: ['Name', 'TotalPrice', 'Quantity']
    }) wiredLineItems ({ data, error }) {
        if (data) {
            this.products = data.records;
            if (this.products) {
                this.displayToastMessage('Success', 'Products loaded', 'success');
                this.productData = this.products.map((product) => {
                    return {
                        Name: product?.fields?.Name?.value,
                        TotalPrice: product?.fields?.TotalPrice?.displayValue,
                        Quantity: product?.fields?.Quantity?.value
                    }
                });

                console.log(JSON.stringify(this.productData));
            }
        } else if (error) {
            console.clear();
            console.error(error);
        }
    }

    displayToastMessage (title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}