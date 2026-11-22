import { api, LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class ProductList extends LightningElement {

    @track products;
    @api recordId;
    @track opportunity = {};

    @wire(getRecord, { recordId: '$recordId', fields: [
        'Opportunity.Name', 'Opportunity.Amount', 'Opportunity.StageName', 'Opportunity.Account.Name'
    ] })
    wiredOpportunityRecord ({ data, error }) {
        if (data) {
            this.opportunity['name']     = data.fields.Name.value.toUpperCase();
            this.opportunity['amount']   = data.fields.Amount.value;
            this.opportunity['stage']    = data.fields.StageName.value;
            this.opportunity['accName']  = data.fields.Account.displayValue;
        } else if (error) {
            console.error(error);
        }
    }
}