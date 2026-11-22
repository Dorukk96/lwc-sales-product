import { api, LightningElement, track, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

export default class ProductList extends LightningElement {

    @track products;
    @api recordId;
    @track opportunity = {};

    @track oppKeys; 
    @track oppValues;


    @wire(getRecord, { recordId: '$recordId', fields: [
        'Opportunity.Name', 'Opportunity.Amount', 'Opportunity.StageName', 'Opportunity.Account.Name'
    ] })
    wiredOpportunityRecord ({ data, error }) {
        if (data) {
            this.opportunity['Account']       = data.fields.Amount.value;
            this.opportunity['Name']         = data.fields.Name.value.toUpperCase();
            this.opportunity['Stage Name']    = data.fields.StageName.value;
            this.opportunity['Account Name']  = data.fields.Account.displayValue;
            
            this.oppKeys = Object.keys(this.opportunity);
            
        } else if (error) {
            console.error(error);
        }
    }
}