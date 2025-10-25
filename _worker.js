import { connect } from "cloudflare:sockets";

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nautica Reforged</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Nautica Reforged</h1>
        <p>A faster, more modern proxy tunnel.</p>
    </header>
    <main>
        <div class="controls">
            <input type="text" id="search" placeholder="Search by country or organization...">
            <button id="get-proxies">Get Proxies</button>
        </div>
        <div id="proxy-list">
            <!-- Proxy items will be dynamically inserted here -->
        </div>
    </main>
    <script src="script.js"></script>
</body>
</html>`;

const CSS_CONTENT = `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

:root {
    --background-color: #1a1a2e;
    --primary-color: #16213e;
    --secondary-color: #0f3460;
    --accent-color: #e94560;
    --text-color: #dcdcdc;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
}

header {
    background: var(--primary-color);
    padding: 2rem;
    text-align: center;
    border-bottom: 2px solid var(--accent-color);
}

header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

main {
    padding: 2rem;
}

.controls {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

#search {
    width: 50%;
    padding: 0.8rem;
    border: 1px solid var(--secondary-color);
    border-radius: 5px;
    background: var(--primary-color);
    color: var(--text-color);
    font-size: 1rem;
}

#get-proxies {
    padding: 0.8rem 1.5rem;
    border: none;
    background: var(--accent-color);
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    margin-left: 1rem;
    transition: background 0.3s ease;
}

#get-proxies:hover {
    background: #d43d51;
}

#proxy-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.proxy-item {
    background: var(--primary-color);
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 5px solid var(--accent-color);
    transition: transform 0.3s ease;
}

.proxy-item:hover {
    transform: translateY(-5px);
}

.proxy-item p {
    margin-bottom: 0.5rem;
}

.proxy-item .country {
    font-weight: bold;
}
`;

const JS_CONTENT = `document.addEventListener('DOMContentLoaded', () => {
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
            item.innerHTML = \`<p>\${proxy.display}</p>\`;
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
`;

// Variables
let serviceName = "";
let APP_DOMAIN = "";

let prxIP = "";

// Embedded Proxy Data
const EMBEDDED_KV_PRX_LIST = {"AM":["2.56.204.183:443","213.159.76.175:443","2.56.206.114:2053","2.56.206.114:8443","2.56.205.182:8443","2.56.205.182:2053","213.159.76.202:2053","213.159.76.202:8443","194.156.103.58:41210","2.56.206.64:443"],"AE":["152.32.181.246:44070","84.235.245.18:34501","129.151.128.114:34834","129.151.128.105:16731","45.86.228.104:443","139.185.50.5:14594","193.123.81.105:443","139.185.39.237:48008","193.123.90.82:12648","217.195.200.138:443"],"AT":["94.177.8.11:443","94.177.8.19:443","94.177.8.10:443","94.177.8.2:443","94.177.8.26:443","94.177.8.31:443","94.177.8.21:443","94.177.8.4:443","94.177.8.43:443","94.177.8.34:443"],"DE":["212.113.106.40:2053","212.113.106.40:8443","193.233.232.82:8443","77.73.131.77:2053","185.106.94.108:8443","91.103.253.97:2053","37.1.203.192:443","193.124.92.170:443","195.133.64.185:443","91.107.134.186:2083"],"IN":["216.10.243.159:443","172.232.112.240:587","65.20.82.22:443","148.113.43.228:2053","146.56.48.138:23010","152.70.75.80:15805","148.113.43.228:8443","134.195.137.107:22473","152.70.76.104:46000","166.0.244.206:2053"],"US":["159.100.198.106:443","206.201.196.122:443","199.59.229.178:443","141.11.136.193:53300","172.82.16.38:27043","172.82.16.38:27061","172.82.16.38:25122","172.82.16.38:30387","172.82.16.38:25953","147.75.236.96:443"],"AU":["170.64.152.77:7443","125.7.24.251:443","152.67.101.72:23010","192.9.190.80:23862","152.69.174.99:25248","192.9.183.128:45673","130.162.193.183:15401","45.77.236.204:443"],"FI":["91.108.241.161:2053","91.108.241.44:8443","91.108.241.161:8443","91.108.241.56:2053","91.108.241.5:2053","91.108.241.56:8443","37.27.17.144:22222","95.216.17.80:443","185.188.181.49:443","37.27.4.238:443"],"BE":["34.22.190.30:443","95.164.62.196:443"],"NL":["91.90.194.87:443","91.103.253.193:443","194.58.39.80:443","45.155.249.66:443","109.120.150.189:443","109.120.150.175:443","109.237.98.57:443","147.45.43.232:443","185.125.230.155:443","185.229.65.253:443"],"BG":["185.82.218.224:443","185.82.218.224:8443","185.82.218.224:9443","193.239.160.24:443","193.239.160.25:443","78.128.127.89:443","213.183.63.185:443","79.124.7.236:444","213.183.63.71:57743","213.183.63.71:53811"],"CA":["192.18.150.121:27620","140.238.158.238:8080","140.238.158.238:443","213.255.209.207:443","104.234.240.114:8443","104.234.240.179:8443","213.255.209.189:443","138.197.152.31:2053","138.197.152.31:8443","148.113.204.36:2053"],"BR":["144.22.144.168:4242","144.22.204.102:50317","38.180.78.255:443","146.235.59.153:8443","38.180.79.9:443","146.235.59.153:2053","132.226.163.224:2053","132.226.163.224:8443","147.45.116.61:8443","147.45.116.50:24443"],"CH":["91.90.193.24:443","38.180.161.11:443","179.43.176.163:10443","176.10.125.114:443","179.43.144.10:8000","45.85.93.121:443","91.245.225.69:443","45.85.93.21:443","179.43.176.163:443","179.43.156.113:13338"],"LV":["185.237.219.169:443","138.124.182.204:443","178.248.75.36:2053","185.135.86.120:2053","178.248.75.36:8443","185.135.86.89:8443","185.237.218.134:8443","103.231.73.153:443","185.135.86.252:443","185.237.218.134:2053"],"CN":["192.3.113.4:19318"],"HK":["156.230.12.71:443","192.131.142.161:46639","43.132.244.52:21415","103.247.28.240:37211","118.141.64.192:36619","124.244.92.109:25203","141.11.175.133:8080","141.11.77.248:8080","141.11.218.249:8080","141.11.148.60:8080"],"PL":["45.82.255.214:2053","45.82.255.214:8443","146.59.19.208:8443","146.59.19.208:2053","54.37.235.201:443","91.239.148.133:443","37.233.102.53:443","91.239.148.53:443","38.180.51.120:443","91.239.148.100:443"],"CY":["91.223.208.217:443"],"CZ":["81.91.214.85:443","38.180.48.228:443","81.91.214.162:443"],"FR":["94.23.171.114:8443","94.23.171.114:2053","45.85.146.60:443","109.120.179.49:2053","89.208.97.163:443","94.23.163.46:443","194.24.161.146:4090","217.182.61.115:80","89.117.57.4:2053","94.23.167.24:2053"],"GB":["213.165.88.177:443","109.61.95.21:8080","185.66.164.51:443","51.89.128.93:44004","51.89.128.93:12122","77.91.101.141:443","213.1.145.50:443","104.128.190.65:443","198.244.169.93:12122","45.61.138.147:443"],"DK":["89.28.236.243:443","38.180.72.162:2053"],"EE":["37.252.5.75:443","5.101.180.145:443","45.129.199.232:443"],"RO":["176.97.76.48:2053","45.67.34.89:8443","194.68.44.27:81","185.225.17.233:2053","185.225.17.233:8443","45.67.34.74:2053","185.104.181.228:443","193.168.143.152:443","94.131.119.136:81","94.131.119.50:2053"],"ES":["34.175.202.195:443","103.45.245.201:29016","91.149.242.110:443","103.45.245.201:59889","38.180.52.83:443","185.231.204.186:443","176.97.72.18:443","185.114.72.119:24780","103.45.245.208:2053","185.114.72.92:8443"],"HU":["95.164.23.71:443","46.183.186.57:443"],"ID":["43.218.77.16:1443","203.194.112.119:8443","203.194.112.119:2053","43.218.77.16:443","36.95.152.58:12137","103.6.207.108:8080"],"IE":["40.113.60.248:2053","40.113.60.248:8443","34.253.234.62:443","54.229.164.147:2053","63.32.194.15:8443"],"IL":["212.80.205.244:2053","77.91.69.238:2053","77.91.69.141:2053","94.131.114.54:2053","77.91.74.150:8443","77.91.69.238:8443","77.91.69.146:443","77.91.69.141:8443","77.91.74.150:2053","212.80.205.244:8443"],"IT":["212.237.30.220:443","129.152.2.127:1488","38.180.22.20:1001","80.211.231.169:443","185.248.144.63:8443","188.213.168.52:443","87.120.237.36:81","185.47.172.172:8443","158.180.233.125:55137","94.177.199.119:2053"],"JP":["198.13.42.58:32954","217.142.230.253:587","138.2.10.217:27446","212.52.0.61:1846","118.27.12.40:38443","140.83.57.114:25965","138.2.32.76:15821","138.2.10.149:45638","158.101.152.6:2919","45.76.198.248:443"],"KR":["129.154.54.67:19567","64.110.70.205:23022","158.247.250.157:81","144.24.87.69:50001","146.56.140.79:44699","146.56.140.79:22561","158.180.85.127:20721","119.197.255.195:30036","152.70.245.66:12693","217.142.138.61:37914"],"KZ":["80.90.183.75:8443","188.116.20.93:443","103.106.3.238:443","45.82.14.221:443","91.200.151.172:443","80.90.183.75:2053","213.148.1.150:2053","213.148.10.177:443","38.180.37.102:8443","94.131.2.187:2053"],"RU":["45.80.208.126:8081","82.97.249.34:2053","82.97.249.34:8443","109.120.189.103:1488","141.105.70.114:443","147.45.164.133:8443","147.45.245.15:443","147.45.164.133:2053","176.109.106.61:8443","147.45.175.165:8443"],"LT":["195.238.126.52:443","103.113.69.46:443","195.238.126.94:443"],"MD":["194.156.67.85:2053","176.123.8.150:443","194.156.67.85:8443","109.185.236.240:443","45.140.146.80:2053","45.67.229.128:81","45.140.146.80:8443","45.86.86.53:443","91.208.206.103:443","91.208.162.68:443"],"TR":["185.234.66.91:443","45.89.52.247:443","94.131.123.74:443","62.133.63.86:8443","185.219.134.25:31564","185.8.129.187:443","185.39.204.55:2053","188.132.129.2:8443","188.132.129.84:8443","185.8.129.187:2096"],"MX":["140.84.178.238:23010","201.149.15.14:21585"],"MY":["38.60.193.247:13300"],"MU":["41.76.42.118:443","41.76.42.116:443"],"SE":["89.169.35.188:443","77.221.140.128:443","212.113.101.35:443","89.22.234.213:443","89.169.34.172:443","212.113.100.65:443","89.22.232.227:443","147.45.74.190:443","77.221.136.95:443","185.230.143.121:443"],"PH":["61.245.11.69:2053"],"UA":["82.118.22.141:2053","82.118.22.141:8443","194.38.20.78:443","91.218.212.223:443"],"PT":["45.159.251.8:81"],"RS":["38.180.100.80:443","38.180.101.177:443"],"SG":["47.74.254.191:8900","129.150.58.86:57621","138.2.89.238:43254","146.235.18.248:45137","213.35.108.135:12596","178.128.80.43:443","194.127.193.240:50791","47.245.95.160:1443","47.236.119.190:51342","129.150.49.58:18650"],"SK":["5.180.55.184:2053"],"TH":["45.144.167.46:19816","171.103.164.62:30921","171.103.232.58:20475"],"TW":["103.137.63.205:31564","60.249.114.181:26398","60.249.114.181:32003","60.249.114.181:21574"],"VN":["152.32.255.24:587","103.15.90.134:49678"]};
const EMBEDDED_PRX_LIST = "152.32.181.246,44070,AE,UCLOUD INFORMATION TECHNOLOGY (HK) LIMITED\n84.235.245.18,34501,AE,Oracle Svenska AB\n129.151.128.114,34834,AE,Oracle Corporation\n129.151.128.105,16731,AE,Oracle Corporation\n45.86.228.104,443,AE,BlueVPS OU\n139.185.50.5,14594,AE,Oracle Corporation\n193.123.81.105,443,AE,Oracle Corporation\n139.185.39.237,48008,AE,Oracle Corporation\n193.123.90.82,12648,AE,Oracle Corporation\n217.195.200.138,443,AE,G-Core Labs Customer assignment\n185.209.49.17,8443,AE,ITGLOBAL COM DMCC\n38.180.11.201,443,AE,3NT SOLUTIONS LLP\n176.97.78.80,2053,AE,IROKO Networks Corporation\n176.97.66.175,443,AE,3nt solutions LLP\n176.97.67.38,443,AE,3nt solutions LLP\n139.185.34.131,443,AE,Oracle Corporation\n2.56.204.183,443,AM,Proitlab LLC\n213.159.76.175,443,AM,WorkTitans B.V.\n2.56.206.114,2053,AM,Proitlab LLC\n2.56.206.114,8443,AM,Proitlab LLC\n2.56.205.182,8443,AM,Proitlab LLC\n2.56.205.182,2053,AM,Proitlab LLC\n213.159.76.202,2053,AM,WorkTitans B.V.\n213.159.76.202,8443,AM,WorkTitans B.V.\n194.156.103.58,41210,AM,GLOBAL CONNECTIVITY SOLUTIONS LLP\n2.56.206.64,443,AM,Proitlab LLC\n194.156.103.31,8443,AM,GLOBAL CONNECTIVITY SOLUTIONS LLP\n94.177.8.11,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.19,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.10,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.2,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.26,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.31,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.21,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.4,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.43,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.34,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.5,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.3,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.23,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.48,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.40,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.51,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.50,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.9,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.60,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.8,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.6,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.62,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.177.8.54,443,AT,Alwyzon, a trading name of Hohl IT e.U.\n94.228.169.108,443,AT,Aeza International LTD\n77.73.131.188,443,AT,Aeza International LTD\n170.64.152.77,7443,AU,DigitalOcean, LLC\n125.7.24.251,443,AU,Macquarie Telecom\n152.67.101.72,23010,AU,Oracle Public Cloud\n192.9.190.80,23862,AU,Oracle Corporation\n152.69.174.99,25248,AU,Oracle Corporation\n192.9.183.128,45673,AU,Oracle Corporation\n130.162.193.183,15401,AU,Oracle Public Cloud\n45.77.236.204,443,AU,Vultr Holdings, LLC\n34.22.190.30,443,BE,Google LLC\n95.164.62.196,443,BE,WorkTitans B.V.\n185.82.218.224,443,BG,ITLDC EU2.SOF Datacenter Network\n185.82.218.224,8443,BG,ITLDC EU2.SOF Datacenter Network\n185.82.218.224,9443,BG,ITLDC EU2.SOF Datacenter Network\n193.239.160.24,443,BG,FIRST SERVER LIMITED\n193.239.160.25,443,BG,FIRST SERVER LIMITED\n78.128.127.89,443,BG,DA International Group Ltd.\n213.183.63.185,443,BG,Melbicom infrastructure\n79.124.7.236,444,BG,Lir.bg EOOD\n213.183.63.71,57743,BG,Melbikomas UAB\n213.183.63.71,53811,BG,Melbikomas UAB\n94.156.35.144,18836,BG,Belcloud LTD\n91.215.153.85,443,BG,Friendhosting LTD\n144.22.144.168,4242,BR,Oracle Corporation\n144.22.204.102,50317,BR,Oracle Corporation\n38.180.78.255,443,BR,3NT SOLUTIONS LLP\n146.235.59.153,8443,BR,Oracle Corporation\n38.180.79.9,443,BR,3NT SOLUTIONS LLP\n146.235.59.153,2053,BR,Oracle Corporation\n132.226.163.224,2053,BR,Oracle Public Cloud\n132.226.163.224,8443,BR,Oracle Public Cloud\n147.45.116.61,8443,BR,GLOBAL CONNECTIVITY SOLUTIONS LLP\n147.45.116.50,24443,BR,GLOBAL CONNECTIVITY SOLUTIONS LLP\n168.75.92.141,28053,BR,Oracle Corporation\n156.154.245.83,443,BR,Vercara, LLC\n192.18.150.121,27620,CA,Oracle Corporation\n140.238.158.238,8080,CA,Oracle Public Cloud\n140.238.158.238,443,CA,Oracle Public Cloud\n213.255.209.207,443,CA,Cloud Web Manage\n104.234.240.114,8443,CA,Private Customer\n104.234.240.179,8443,CA,Private Customer\n213.255.209.189,443,CA,Cloud Web Manage\n138.197.152.31,2053,CA,DigitalOcean, LLC\n138.197.152.31,8443,CA,DigitalOcean, LLC\n148.113.204.36,2053,CA,OVH Hosting, Inc.\n150.230.27.23,16504,CA,Oracle Corporation\n148.113.204.36,8443,CA,OVH Hosting, Inc.\n172.93.32.131,23077,CA,Cluster Logic Inc\n172.105.26.112,2443,CA,Linode\n192.18.159.164,36545,CA,Oracle Corporation\n172.98.207.58,443,CA,CENTRILOGICCANADA\n192.99.252.243,2053,CA,OVH SAS\n209.200.246.130,443,CA,OVH Hosting, Inc.\n3.97.173.206,80,CA,Securly, Inc\n35.182.7.190,443,CA,Securly, Inc\n35.183.163.195,443,CA,Securly, Inc\n35.182.7.190,80,CA,Securly, Inc\n35.183.163.195,80,CA,Securly, Inc\n64.21.191.164,443,CA,N6 Cloud inc.\n64.15.75.112,2053,CA,eStruxture Data Centers Inc.\n69.28.83.244,443,CA,Atlantic.Net - Toronto, LLC.\n69.28.82.253,443,CA,Atlantic.Net - Toronto, LLC.\n89.251.9.4,15466,CA,Deployish Limited\n91.90.193.24,443,CH,Friendhosting LTD\n38.180.161.11,443,CH,3NT SOLUTIONS LLP\n179.43.176.163,10443,CH,PRIVATE LAYER INC\n176.10.125.114,443,CH,Datasource AG\n179.43.144.10,8000,CH,PRIVATE LAYER INC\n45.85.93.121,443,CH,Internet Utilities Europe and Asia Limited\n91.245.225.69,443,CH,GLB Bulut Teknolojisi Limited Sirketi\n45.85.93.21,443,CH,Internet Utilities Europe and Asia Limited\n179.43.176.163,443,CH,PRIVATE LAYER INC\n179.43.156.113,13338,CH,PRIVATE LAYER INC\n38.180.85.203,443,CH,3NT SOLUTIONS LLP\n179.43.166.2,443,CH,PRIVATE LAYER INC\n185.195.69.119,8443,CH,Datasource AG\n185.195.69.119,2053,CH,Datasource AG\n179.43.190.20,2053,CH,PRIVATE LAYER INC\n179.43.190.20,8443,CH,PRIVATE LAYER INC\n194.135.22.181,443,CH,GLB Bulut Teknolojisi Limited Sirketi\n185.195.69.200,8443,CH,Datasource AG\n185.195.69.200,2053,CH,Datasource AG\n185.195.69.209,2053,CH,Datasource AG\n194.87.18.92,443,CH,Reliable Communications s.r.o.\n194.87.97.6,2053,CH,GLB Bulut Teknolojisi Limited Sirketi\n194.87.97.6,8443,CH,GLB Bulut Teknolojisi Limited Sirketi\n38.180.84.46,443,CH,3NT SOLUTIONS LLP\n38.180.15.197,2053,CH,3NT SOLUTIONS LLP\n38.180.15.45,443,CH,3NT SOLUTIONS LLP\n45.85.93.96,443,CH,Internet Utilities Europe and Asia Limited\n45.95.232.115,2053,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n45.90.58.58,81,CH,Green Floid LLC\n45.85.93.83,443,CH,Internet Utilities Europe and Asia Limited\n45.85.93.49,443,CH,Internet Utilities Europe and Asia Limited\n45.95.232.18,8443,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n45.95.232.18,2053,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n45.95.232.203,2053,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n45.95.232.203,8443,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n45.95.232.236,2053,CH,GLOBAL CONNECTIVITY SOLUTIONS LLP\n91.192.102.170,2053,CH,Datasource AG\n91.192.102.55,443,CH,Datasource AG\n83.173.198.77,8443,CH,Swisscom (Schweiz) AG\n94.131.12.56,443,CH,WorkTitans B.V.\n91.245.225.79,8443,CH,GLB Bulut Teknolojisi Limited Sirketi\n91.245.225.79,2053,CH,GLB Bulut Teknolojisi Limited Sirketi\n95.183.51.10,2053,CH,Solar Communications GmbH\n94.247.42.207,443,CH,servinga GmbH\n95.183.51.10,8443,CH,Solar Communications GmbH\n179.43.156.21,8443,CH,Private Layer INC\n104.244.78.95,2083,CH,BuyVM\n192.3.113.4,19318,CN,Hurricane Electric LLC\n91.223.208.217,443,CY,CLOUDLAYER8 LIMITED\n81.91.214.85,443,CZ,OvaNet, a.s.\n38.180.48.228,443,CZ,3NT SOLUTIONS LLP\n81.91.214.162,443,CZ,OvaNet, a.s.`;

// Constant
const horse = "dHJvamFu";
const flash = "dm1lc3M=";
const v2 = "djJyYXk=";
const neko = "Y2xhc2g=";

const PORTS = [443, 80];
const PROTOCOLS = [atob(horse), atob(flash), "ss"];
const SUB_PAGE_URL = "https://foolvpn.me/nautica";
const KV_PRX_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/kvProxyList.json";
const PRX_BANK_URL = "https://raw.githubusercontent.com/FoolVPN-ID/Nautica/refs/heads/main/proxyList.txt";
const DNS_SERVER_ADDRESS = "8.8.8.8";
const DNS_SERVER_PORT = 53;
const RELAY_SERVER_UDP = {
  host: "udp-relay.hobihaus.space", // Kontribusi atau cek relay publik disini: https://hub.docker.com/r/kelvinzer0/udp-relay
  port: 7300,
};
const WS_READY_STATE_OPEN = 1;
const WS_READY_STATE_CLOSING = 2;
const CORS_HEADER_OPTIONS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

async function getKVPrxList() {
  return EMBEDDED_KV_PRX_LIST;
}

async function getPrxList() {
  const prxString = EMBEDDED_PRX_LIST.split("\n").filter(Boolean);
  return prxString
    .map((entry) => {
      const [prxIP, prxPort, country, org] = entry.split(",");
      return {
        prxIP: prxIP || "Unknown",
        prxPort: prxPort || "Unknown",
        country: country || "Unknown",
        org: org || "Unknown Org",
      };
    })
    .filter(Boolean);
}

function convertToClash(urls) {
  const proxies = [];
  for (const url of urls) {
    try {
      const u = new URL(url);
      const proxy = {};
      proxy.name = decodeURIComponent(u.hash.substring(1));
      proxy.server = u.hostname;
      proxy.port = u.port;
      proxy.type = u.protocol.slice(0, -1);

      if (proxy.type === 'vless' || proxy.type === 'trojan') {
        proxy.uuid = u.username;
        proxy.network = u.searchParams.get('type');
        proxy.ws_opts = {
          path: u.searchParams.get('path'),
          headers: {
            Host: u.searchParams.get('host')
          }
        };
        if (u.searchParams.get('security') === 'tls') {
          proxy.tls = true;
          proxy.servername = u.searchParams.get('sni');
        }
      } else if (proxy.type === 'ss') {
        const userInfo = atob(u.username).split(':');
        proxy.cipher = userInfo[0];
        proxy.password = userInfo[1];
      }

      proxies.push(proxy);
    } catch (e) {
      // Ignore invalid URLs
    }
  }

  const clashConfig = {
    "mixed-port": 7890,
    "allow-lan": false,
    "mode": "rule",
    "log-level": "info",
    "external-controller": "127.0.0.1:9090",
    "proxies": proxies,
    "proxy-groups": [
      {
        "name": "PROXY",
        "type": "select",
        "proxies": proxies.map(p => p.name)
      }
    ],
    "rules": [
      "DOMAIN-SUFFIX,google.com,PROXY",
      "DOMAIN-KEYWORD,google,PROXY",
      "MATCH,DIRECT"
    ]
  };

  // A simple YAML serializer
  let yaml = '';
  for (const key in clashConfig) {
    if (key === 'proxies' || key === 'proxy-groups') {
      yaml += `${key}:\n`;
      for (const item of clashConfig[key]) {
        yaml += `  - ${JSON.stringify(item)}\n`;
      }
    } else if (key === 'rules') {
      yaml += `rules:\n`;
      for (const rule of clashConfig[key]) {
        yaml += `  - ${rule}\n`;
      }
    } else {
      yaml += `${key}: ${JSON.stringify(clashConfig[key])}\n`;
    }
  }

  return yaml;
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      APP_DOMAIN = url.hostname;
      serviceName = APP_DOMAIN.split(".")[0];

      if (url.pathname === '/') {
        return new Response(HTML_CONTENT, { headers: { 'Content-Type': 'text/html' } });
      }
      if (url.pathname === '/style.css') {
        return new Response(CSS_CONTENT, { headers: { 'Content-Type': 'text/css' } });
      }
      if (url.pathname === '/script.js') {
        return new Response(JS_CONTENT, { headers: { 'Content-Type': 'application/javascript' } });
      }

      const upgradeHeader = request.headers.get("Upgrade");

      // Handle prx client
      if (upgradeHeader === "websocket") {
        const prxMatch = url.pathname.match(/^\/(.+[:=-]\d+)$/);

        if (url.pathname.length == 3 || url.pathname.match(",")) {
          // Contoh: /ID, /SG, dll
          const prxKeys = url.pathname.replace("/", "").toUpperCase().split(",");
          const prxKey = prxKeys[Math.floor(Math.random() * prxKeys.length)];
          const kvPrx = await getKVPrxList();

          prxIP = kvPrx[prxKey][Math.floor(Math.random() * kvPrx[prxKey].length)];

          return await websocketHandler(request);
        } else if (prxMatch) {
          prxIP = prxMatch[1];
          return await websocketHandler(request);
        }
      }

      if (url.pathname.startsWith("/check")) {
        const target = url.searchParams.get("target").split(":");
        const result = await checkProxyHealth(target[0], target[1] || "443");

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            ...CORS_HEADER_OPTIONS,
            "Content-Type": "application/json",
          },
        });
      } else if (url.pathname.startsWith("/api/v1")) {
        const apiPath = url.pathname.replace("/api/v1", "");

        if (apiPath.startsWith("/sub")) {
          const filterCC = url.searchParams.get("cc")?.split(",") || [];
          const filterPort = url.searchParams.get("port")?.split(",") || PORTS;
          const filterVPN = url.searchParams.get("vpn")?.split(",") || PROTOCOLS;
          const filterLimit = parseInt(url.searchParams.get("limit")) || 10;
          const filterFormat = url.searchParams.get("format") || "raw";
          const fillerDomain = url.searchParams.get("domain") || APP_DOMAIN;

          const prxBankUrl = url.searchParams.get("prx-list") || env.PRX_BANK_URL;
          const prxList = await getPrxList(prxBankUrl)
            .then((prxs) => {
              // Filter CC
              if (filterCC.length) {
                return prxs.filter((prx) => filterCC.includes(prx.country));
              }
              return prxs;
            })
            .then((prxs) => {
              // shuffle result
              shuffleArray(prxs);
              return prxs;
            });

          const uuid = crypto.randomUUID();
          const result = [];
          for (const prx of prxList) {
            const uri = new URL(`${atob(horse)}://${fillerDomain}`);
            uri.searchParams.set("encryption", "none");
            uri.searchParams.set("type", "ws");
            uri.searchParams.set("host", APP_DOMAIN);

            for (const port of filterPort) {
              for (const protocol of filterVPN) {
                if (result.length >= filterLimit) break;

                uri.protocol = protocol;
                uri.port = port.toString();
                if (protocol == "ss") {
                  uri.username = btoa(`none:${uuid}`);
                  uri.searchParams.set(
                    "plugin",
                    `${atob(v2)}-plugin${port == 80 ? "" : ";tls"};mux=0;mode=websocket;path=/${prx.prxIP}-${
                      prx.prxPort
                    };host=${APP_DOMAIN}`
                  );
                } else {
                  uri.username = uuid;
                }

                uri.searchParams.set("security", port == 443 ? "tls" : "none");
                uri.searchParams.set("sni", port == 80 && protocol == atob(flash) ? "" : APP_DOMAIN);
                uri.searchParams.set("path", `/${prx.prxIP}-${prx.prxPort}`);

                uri.hash = `${result.length + 1} ${getFlagEmoji(prx.country)} ${prx.org} WS ${
                  port == 443 ? "TLS" : "NTLS"
                } [${serviceName}]`;
                result.push(uri.toString());
              }
            }
          }

          let finalResult = "";
          switch (filterFormat) {
            case "raw":
              finalResult = result.join("\n");
              break;
            case atob(v2):
              finalResult = btoa(result.join("\n"));
              break;
            case atob(neko): // clash
              finalResult = convertToClash(result);
              break;
          }

          return new Response(finalResult, {
            status: 200,
            headers: {
              ...CORS_HEADER_OPTIONS,
            },
          });
        } else if (apiPath.startsWith("/myip")) {
          return new Response(
            JSON.stringify({
              ip:
                request.headers.get("cf-connecting-ipv6") ||
                request.headers.get("cf-connecting-ip") ||
                request.headers.get("x-real-ip"),
              colo: request.headers.get("cf-ray")?.split("-")[1],
              ...request.cf,
            }),
            {
              headers: {
                ...CORS_HEADER_OPTIONS,
              },
            }
          );
        }
      }

      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return new Response(`An error occurred: ${err.toString()}`, {
        status: 500,
        headers: {
          ...CORS_HEADER_OPTIONS,
        },
      });
    }
  },
};

async function websocketHandler(request) {
  const webSocketPair = new WebSocketPair();
  const [client, webSocket] = Object.values(webSocketPair);

  webSocket.accept();

  let addressLog = "";
  let portLog = "";
  const log = (info, event) => {
    console.log(`[${addressLog}:${portLog}] ${info}`, event || "");
  };
  const earlyDataHeader = request.headers.get("sec-websocket-protocol") || "";

  const readableWebSocketStream = makeReadableWebSocketStream(webSocket, earlyDataHeader, log);

  let remoteSocketWrapper = {
    value: null,
  };
  let isDNS = false;

  readableWebSocketStream
    .pipeTo(
      new WritableStream({
        async write(chunk, controller) {
          if (isDNS) {
            return handleUDPOutbound(
              DNS_SERVER_ADDRESS,
              DNS_SERVER_PORT,
              chunk,
              webSocket,
              null,
              log,
              RELAY_SERVER_UDP
            );
          }
          if (remoteSocketWrapper.value) {
            const writer = remoteSocketWrapper.value.writable.getWriter();
            await writer.write(chunk);
            writer.releaseLock();
            return;
          }

          const protocol = await protocolSniffer(chunk);
          let protocolHeader;

          if (protocol === atob(horse)) {
            protocolHeader = readHorseHeader(chunk);
          } else if (protocol === atob(flash)) {
            protocolHeader = readFlashHeader(chunk);
          } else if (protocol === "ss") {
            protocolHeader = readSsHeader(chunk);
          } else {
            throw new Error("Unknown Protocol!");
          }

          addressLog = protocolHeader.addressRemote;
          portLog = `${protocolHeader.portRemote} -> ${protocolHeader.isUDP ? "UDP" : "TCP"}`;

          if (protocolHeader.hasError) {
            throw new Error(protocolHeader.message);
          }

          if (protocolHeader.isUDP) {
            if (protocolHeader.portRemote === 53) {
              isDNS = true;
              return handleUDPOutbound(
                DNS_SERVER_ADDRESS,
                DNS_SERVER_PORT,
                chunk,
                webSocket,
                protocolHeader.version,
                log,
                RELAY_SERVER_UDP
              );
            }

            return handleUDPOutbound(
              protocolHeader.addressRemote,
              protocolHeader.portRemote,
              chunk,
              webSocket,
              protocolHeader.version,
              log,
              RELAY_SERVER_UDP
            );
          }

          handleTCPOutBound(
            remoteSocketWrapper,
            protocolHeader.addressRemote,
            protocolHeader.portRemote,
            protocolHeader.rawClientData,
            webSocket,
            protocolHeader.version,
            log
          );
        },
        close() {
          log(`readableWebSocketStream is close`);
        },
        abort(reason) {
          log(`readableWebSocketStream is abort`, JSON.stringify(reason));
        },
      })
    )
    .catch((err) => {
      log("readableWebSocketStream pipeTo error", err);
    });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}

async function protocolSniffer(buffer) {
  if (buffer.byteLength >= 62) {
    const horseDelimiter = new Uint8Array(buffer.slice(56, 60));
    if (horseDelimiter[0] === 0x0d && horseDelimiter[1] === 0x0a) {
      if (horseDelimiter[2] === 0x01 || horseDelimiter[2] === 0x03 || horseDelimiter[2] === 0x7f) {
        if (horseDelimiter[3] === 0x01 || horseDelimiter[3] === 0x03 || horseDelimiter[3] === 0x04) {
          return atob(horse);
        }
      }
    }
  }

  const flashDelimiter = new Uint8Array(buffer.slice(1, 17));
  // Hanya mendukung UUID v4
  if (arrayBufferToHex(flashDelimiter).match(/^[0-9a-f]{8}[0-9a-f]{4}4[0-9a-f]{3}[89ab][0-9a-f]{3}[0-9a-f]{12}$/i)) {
    return atob(flash);
  }

  return "ss"; // default
}

async function handleTCPOutBound(
  remoteSocket,
  addressRemote,
  portRemote,
  rawClientData,
  webSocket,
  responseHeader,
  log
) {
  async function connectAndWrite(address, port) {
    const tcpSocket = connect({
      hostname: address,
      port: port,
    });
    remoteSocket.value = tcpSocket;
    log(`connected to ${address}:${port}`);
    const writer = tcpSocket.writable.getWriter();
    await writer.write(rawClientData);
    writer.releaseLock();

    return tcpSocket;
  }

  async function retry() {
    const tcpSocket = await connectAndWrite(
      prxIP.split(/[:=-]/)[0] || addressRemote,
      prxIP.split(/[:=-]/)[1] || portRemote
    );
    tcpSocket.closed
      .catch((error) => {
        console.log("retry tcpSocket closed error", error);
      })
      .finally(() => {
        safeCloseWebSocket(webSocket);
      });
    remoteSocketToWS(tcpSocket, webSocket, responseHeader, null, log);
  }

  const tcpSocket = await connectAndWrite(addressRemote, portRemote);

  remoteSocketToWS(tcpSocket, webSocket, responseHeader, retry, log);
}

async function handleUDPOutbound(targetAddress, targetPort, dataChunk, webSocket, responseHeader, log, relay) {
  try {
    let protocolHeader = responseHeader;

    const tcpSocket = connect({
      hostname: relay.host,
      port: relay.port,
    });

    const header = `udp:${targetAddress}:${targetPort}`;
    const headerBuffer = new TextEncoder().encode(header);
    const separator = new Uint8Array([0x7c]);
    const relayMessage = new Uint8Array(headerBuffer.length + separator.length + dataChunk.byteLength);
    relayMessage.set(headerBuffer, 0);
    relayMessage.set(separator, headerBuffer.length);
    relayMessage.set(new Uint8Array(dataChunk), headerBuffer.length + separator.length);

    const writer = tcpSocket.writable.getWriter();
    await writer.write(relayMessage);
    writer.releaseLock();

    await tcpSocket.readable.pipeTo(
      new WritableStream({
        async write(chunk) {
          if (webSocket.readyState === WS_READY_STATE_OPEN) {
            if (protocolHeader) {
              webSocket.send(await new Blob([protocolHeader, chunk]).arrayBuffer());
              protocolHeader = null;
            } else {
              webSocket.send(chunk);
            }
          }
        },
        close() {
          log(`UDP connection to ${targetAddress} closed`);
        },
        abort(reason) {
          console.error(`UDP connection aborted due to ${reason}`);
        },
      })
    );
  } catch (e) {
    console.error(`Error while handling UDP outbound: ${e.message}`);
  }
}

function makeReadableWebSocketStream(webSocketServer, earlyDataHeader, log) {
  let readableStreamCancel = false;
  const stream = new ReadableStream({
    start(controller) {
      webSocketServer.addEventListener("message", (event) => {
        if (readableStreamCancel) {
          return;
        }
        const message = event.data;
        controller.enqueue(message);
      });
      webSocketServer.addEventListener("close", () => {
        safeCloseWebSocket(webSocketServer);
        if (readableStreamCancel) {
          return;
        }
        controller.close();
      });
      webSocketServer.addEventListener("error", (err) => {
        log("webSocketServer has error");
        controller.error(err);
      });
      const { earlyData, error } = base64ToArrayBuffer(earlyDataHeader);
      if (error) {
        controller.error(error);
      } else if (earlyData) {
        controller.enqueue(earlyData);
      }
    },

    pull(controller) {},
    cancel(reason) {
      if (readableStreamCancel) {
        return;
      }
      log(`ReadableStream was canceled, due to ${reason}`);
      readableStreamCancel = true;
      safeCloseWebSocket(webSocketServer);
    },
  });

  return stream;
}

function readSsHeader(ssBuffer) {
  const view = new DataView(ssBuffer);

  const addressType = view.getUint8(0);
  let addressLength = 0;
  let addressValueIndex = 1;
  let addressValue = "";

  switch (addressType) {
    case 1:
      addressLength = 4;
      addressValue = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3:
      addressLength = new Uint8Array(ssBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4:
      addressLength = 16;
      const dataView = new DataView(ssBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `Invalid addressType for SS: ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `Destination address empty, address type is: ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = ssBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 2,
    rawClientData: ssBuffer.slice(portIndex + 2),
    version: null,
    isUDP: portRemote == 53,
  };
}

function readFlashHeader(buffer) {
  const version = new Uint8Array(buffer.slice(0, 1));
  let isUDP = false;

  const optLength = new Uint8Array(buffer.slice(17, 18))[0];

  const cmd = new Uint8Array(buffer.slice(18 + optLength, 18 + optLength + 1))[0];
  if (cmd === 1) {
  } else if (cmd === 2) {
    isUDP = true;
  } else {
    return {
      hasError: true,
      message: `command ${cmd} is not supported`,
    };
  }
  const portIndex = 18 + optLength + 1;
  const portBuffer = buffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);

  let addressIndex = portIndex + 2;
  const addressBuffer = new Uint8Array(buffer.slice(addressIndex, addressIndex + 1));

  const addressType = addressBuffer[0];
  let addressLength = 0;
  let addressValueIndex = addressIndex + 1;
  let addressValue = "";
  switch (addressType) {
    case 1: // For IPv4
      addressLength = 4;
      addressValue = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 2: // For Domain
      addressLength = new Uint8Array(buffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 3: // For IPv6
      addressLength = 16;
      const dataView = new DataView(buffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invild  addressType is ${addressType}`,
      };
  }
  if (!addressValue) {
    return {
      hasError: true,
      message: `addressValue is empty, addressType is ${addressType}`,
    };
  }

  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: addressValueIndex + addressLength,
    rawClientData: buffer.slice(addressValueIndex + addressLength),
    version: new Uint8Array([version[0], 0]),
    isUDP: isUDP,
  };
}

function readHorseHeader(buffer) {
  const dataBuffer = buffer.slice(58);
  if (dataBuffer.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid request data",
    };
  }

  let isUDP = false;
  const view = new DataView(dataBuffer);
  const cmd = view.getUint8(0);
  if (cmd == 3) {
    isUDP = true;
  } else if (cmd != 1) {
    throw new Error("Unsupported command type!");
  }

  let addressType = view.getUint8(1);
  let addressLength = 0;
  let addressValueIndex = 2;
  let addressValue = "";
  switch (addressType) {
    case 1: // For IPv4
      addressLength = 4;
      addressValue = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength)).join(".");
      break;
    case 3: // For Domain
      addressLength = new Uint8Array(dataBuffer.slice(addressValueIndex, addressValueIndex + 1))[0];
      addressValueIndex += 1;
      addressValue = new TextDecoder().decode(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      break;
    case 4: // For IPv6
      addressLength = 16;
      const dataView = new DataView(dataBuffer.slice(addressValueIndex, addressValueIndex + addressLength));
      const ipv6 = [];
      for (let i = 0; i < 8; i++) {
        ipv6.push(dataView.getUint16(i * 2).toString(16));
      }
      addressValue = ipv6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${addressType}`,
      };
  }

  if (!addressValue) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${addressType}`,
    };
  }

  const portIndex = addressValueIndex + addressLength;
  const portBuffer = dataBuffer.slice(portIndex, portIndex + 2);
  const portRemote = new DataView(portBuffer).getUint16(0);
  return {
    hasError: false,
    addressRemote: addressValue,
    addressType: addressType,
    portRemote: portRemote,
    rawDataIndex: portIndex + 4,
    rawClientData: dataBuffer.slice(portIndex + 4),
    version: null,
    isUDP: isUDP,
  };
}

async function remoteSocketToWS(remoteSocket, webSocket, responseHeader, retry, log) {
  let header = responseHeader;
  let hasIncomingData = false;
  await remoteSocket.readable
    .pipeTo(
      new WritableStream({
        start() {},
        async write(chunk, controller) {
          hasIncomingData = true;
          if (webSocket.readyState !== WS_READY_STATE_OPEN) {
            controller.error("webSocket.readyState is not open, maybe close");
          }
          if (header) {
            webSocket.send(await new Blob([header, chunk]).arrayBuffer());
            header = null;
          } else {
            webSocket.send(chunk);
          }
        },
        close() {
          log(`remoteConnection!.readable is close with hasIncomingData is ${hasIncomingData}`);
        },
        abort(reason) {
          console.error(`remoteConnection!.readable abort`, reason);
        },
      })
    )
    .catch((error) => {
      console.error(`remoteSocketToWS has exception `, error.stack || error);
      safeCloseWebSocket(webSocket);
    });
  if (hasIncomingData === false && retry) {
    log(`retry`);
    retry();
  }
}

function safeCloseWebSocket(socket) {
  try {
    if (socket.readyState === WS_READY_STATE_OPEN || socket.readyState === WS_READY_STATE_CLOSING) {
      socket.close();
    }
  } catch (error) {
    console.error("safeCloseWebSocket error", error);
  }
}

async function checkProxyHealth(ip, port) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 seconds timeout

  try {
    const response = await fetch(`http://${ip}:${port}`, {
      signal: controller.signal,
      method: 'HEAD' // Use HEAD request to be lightweight
    });
    clearTimeout(timeoutId);
    return { "status": "ok", "latency": "N/A" };
  } catch (e) {
    clearTimeout(timeoutId);
    if (e.name === 'AbortError') {
      return { "status": "bad", "error": "timeout" };
    }
    return { "status": "bad", "error": e.message };
  }
}

// Helpers
function base64ToArrayBuffer(base64Str) {
  if (!base64Str) {
    return { error: null };
  }
  try {
    base64Str = base64Str.replace(/-/g, "+").replace(/_/g, "/");
    const decode = atob(base64Str);
    const arryBuffer = Uint8Array.from(decode, (c) => c.charCodeAt(0));
    return { earlyData: arryBuffer.buffer, error: null };
  } catch (error) {
    return { error };
  }
}

function arrayBufferToHex(buffer) {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function shuffleArray(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
}

function reverse(s) {
  return s.split("").reverse().join("");
}

function getFlagEmoji(isoCode) {
  const codePoints = isoCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
