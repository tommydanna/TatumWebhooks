//HTML Elements
const subscribeButton = document.getElementById('subscribe');
const listSubscriptionsButton = document.getElementById('listSubscriptions');
const cancelSubscriptionButton = document.getElementById('cancelSubscription');

const statusDiv = document.getElementById('status');
const subscriptionsDiv = document.getElementById('subscriptions');


//Main Vars
const apiKey = 'edb47ab3-1838-458f-86a3-26d813a2a073';
const webHookUrl = 'https://webhook.site/da87c92a-09b8-4615-8a34-e3961152134c';
const region = 'us-west1';
const blockChain = 'SOL';

//Wallet address we are getting notifications from
const walletAddress = 'F8Vyqk3unwxkXukZFQeYyGmFfTG3CAX4v24iyrjEYBJV';

//Get a notification for every transaction that goes through walletAddress
function subscribe(walletAddress) {
    fetch(`https://api-${region}.tatum.io/v3/subscription`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-api-key': apiKey,
        },
        body: JSON.stringify({
            type: 'ADDRESS_TRANSACTION',
            attr: {
                address: walletAddress,
                chain: blockChain,
                url: webHookUrl,
            },
        }),
    })
        .then((data) => data.json())
        .then((data) => {
            statusDiv.textContent = JSON.stringify(data, null, 2);
        });
}

//Show every address we are currently subscribed to
function listSubscriptions() {
    fetch(`https://api-${region}.tatum.io/v3/subscription?pageSize=10&offset=0`, {
        method: 'GET',
        headers: {
            'x-api-key': apiKey,
        },
    })
        .then((data) => data.json())
        .then((subscriptionList) => {
            subscriptionsDiv.innerHTML = '';
            if (subscriptionList.length > 0) {
                for (const subscription of subscriptionList) {
                    const html = `<pre>
                    ${subscription.id}
                    ${subscription.type}
                    ${subscription.attr.address}
                    ${subscription.attr.chain}
                    ${subscription.attr.url}
                    <button onclick="cancelSubscription('${subscription.id}')">Cancel</button>
                    </pre>`;
                    subscriptionsDiv.innerHTML += html;
                }
            } else {
                subscriptionsDiv.innerHTML = 'No Subscriptions';
            }
        });
}

function cancelSubscription(id) {
    fetch(`https://api-${region}.tatum.io/v3/subscription/${id}`, {
        method: 'DELETE',
        headers: {
            'x-api-key': apiKey,
        },
    })
        .then((data) => data.json())
        .then((data) => {
            statusDiv.textContent = JSON.stringify(data, null, 2);
        });
}

subscribeButton.addEventListener('click', () => {
    subscribe(walletAddress);
});

listSubscriptionsButton.addEventListener('click', () => {
    listSubscriptions();
});