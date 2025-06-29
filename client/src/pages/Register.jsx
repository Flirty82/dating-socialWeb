const handleRegister = async () => {
    const res = await axios.post('/api/auth/register', {...formValues });
    const { user, membership } = res.data;

    if (membership === 'Free') {
        NavigationHistoryEntry('/profile/${user._id}');
    } else {
        NavigationHistoryEntry('/payment?userId=${user._id}');
    }
};

    const res = await axios.post('/api/paypal/create-payment', {
        planId,
        user: {
            username: formValues.username,
            email: formValues.email,
            password: formValues.password,
            membership: formValues.membership,
            windowlocationhref : res.data.approvalUrl, // Redirect to PayPal for payment approval
        }
    })

const [membership, setMembership] = useState('free');

const getPlanId = (membership) => {
    switch (membership) {
        case 'free': return 'plan_free';
        case 'platinum': return 'P-9N800265A2819562ENATVMWA';
        case 'diamond': return 'P-5EE86843D5262551HNAT';
        default: return '';
    }
};

<select
onChange={(e) => setMembership(e.target.value)}
className="border p-2 w-full mt-2">
    <option value="free">Free</option>
    <option value="gold">Gold</option>
    <option value="platinum">Platinum</option>
    <option value="diamond">Diamond</option>
</select>

await axios.post('/api/auth/register', {
    username,
    email,
    password,
    membership
});