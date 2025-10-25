document.addEventListener('DOMContentLoaded', () => {
    const getProxiesButton = document.getElementById('get-proxies');
    const proxyListContainer = document.getElementById('proxy-list');
    const searchInput = document.getElementById('search');

    let allProxies = [];

    const fetchProxies = async () => {
        try {
            const response = await fetch('/api/v1/sub');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();
            // This is a simplified parser. A more robust solution would be needed
            // if the format is complex.
            allProxies = data.split('\n').map(line => {
                try {
                    const url = new URL(line);
                    const hash = decodeURIComponent(url.hash.substring(1));
                    return {
                        url: line,
                        display: hash,
                    };
                } catch (e) {
                    return null;
                }
            }).filter(Boolean);

            renderProxies(allProxies);
        } catch (error) {
            console.error('Failed to fetch proxies:', error);
            proxyListContainer.innerHTML = '<p>Error loading proxies.</p>';
        }
    };

    const renderProxies = (proxies) => {
        proxyListContainer.innerHTML = '';
        if (proxies.length === 0) {
            proxyListContainer.innerHTML = '<p>No proxies found.</p>';
            return;
        }

        proxies.forEach(proxy => {
            const item = document.createElement('div');
            item.className = 'proxy-item';
            item.innerHTML = `<p>${proxy.display}</p>`;
            item.addEventListener('click', () => {
                navigator.clipboard.writeText(proxy.url).then(() => {
                    // Maybe show a notification
                });
            });
            proxyListContainer.appendChild(item);
        });
    };

    const filterProxies = () => {
        const query = searchInput.value.toLowerCase();
        const filtered = allProxies.filter(proxy =>
            proxy.display.toLowerCase().includes(query)
        );
        renderProxies(filtered);
    };

    getProxiesButton.addEventListener('click', fetchProxies);
    searchInput.addEventListener('input', filterProxies);
});
