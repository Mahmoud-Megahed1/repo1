
const Brevo = require('@getbrevo/brevo');
console.log('Brevo exports:', Object.keys(Brevo).slice(0, 10), '...');
console.log('TransactionalEmailsApi type:', typeof Brevo.TransactionalEmailsApi);
try {
    const api = new Brevo.TransactionalEmailsApi();
    console.log('Successfully instantiated TransactionalEmailsApi');
} catch (e) {
    console.error('Failed to instantiate TransactionalEmailsApi:', e);
}
