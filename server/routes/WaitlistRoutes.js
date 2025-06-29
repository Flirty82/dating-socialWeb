const { Parser } = require('json2csv');

router.get('/export/csv', async (req, res) => {
    const entries = await WaitlistEntry.find().lean();

    const fields = ['email', 'refCode', 'referredBy', 'referrals', 'joinedAt'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.pare(entries);

    res.header('Content-Type', 'text/csv');
    res.attatchment('waitlist.csv');
    res.send(csv);
});