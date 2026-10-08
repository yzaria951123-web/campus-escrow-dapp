/* PawCraft Studio v1.0 — Ethereum Sepolia escrow frontend.
 * The deployed CampusEscrow contract is unchanged. Orders are public and
 * anyone may list; the interface cannot enforce a studio-only account.
 * Discord and artwork delivery are entirely off-chain.
 */
(() => {
  'use strict';

  const CONTRACT_ADDRESS = '0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A';
  const CHAIN_ID = '0xaa36a7';
  const CHAIN_NUMBER = 11155111;
  const EXPLORER = 'https://sepolia.etherscan.io';
  const REFUND_SECONDS = 7 * 24 * 60 * 60;
  // Set a real Discord server invite / studio contact link here when ready.
  const DISCORD_URL = '';
  const ABI = [
    'function listItem(string name, uint256 price) external',
    'function buyItem(uint256 id) external payable',
    'function confirmReceipt(uint256 id) external',
    'function cancelItem(uint256 id) external',
    'function refund(uint256 id) external',
    'function getItemCount() external view returns (uint256)',
    'function getItem(uint256 id) external view returns (address seller, address buyer, string name, uint256 price, uint256 paidAt, uint8 status)',
    'event ItemListed(uint256 indexed id, address indexed seller, string name, uint256 price)',
    'event ItemPaid(uint256 indexed id, address indexed buyer, uint256 amount)',
    'event ItemCompleted(uint256 indexed id, address indexed seller, uint256 amount)',
    'event ItemCancelled(uint256 indexed id)',
    'event ItemRefunded(uint256 indexed id, address indexed buyer, uint256 amount)'
  ];
  const $ = id => document.getElementById(id);
  const state = { lang: 'en', account: '', provider: null, contract: null, orders: [], filter: 'all', busy: false };
  let toastTimer;
  const gallery = [
    ['🐱', 'Mochi Cat', 'Cute', '#f8ddeb', '#customize'],
    ['🐶', 'Cloud Puppy', 'Soft Fantasy', '#dcecfb', '#customize'],
    ['🐉', 'Mini Dragon', 'Fantasy', '#e0d8f8', '#customize'],
    ['🦊', 'Fox Spirit', 'Magical', '#f9e6cd', '#customize'],
    ['🐰', 'Moon Bunny', 'Dreamy', '#ddf3ec', '#customize'],
    ['🐻', 'Teddy Bear', 'Cozy', '#f3e7d7', '#customize']
  ];
  const locales = {
    en: {
      navGallery:'Gallery',navCustomize:'Customize',navOrders:'Commissions',navHow:'How it works',connect:'Connect Wallet',
      heroTitle:'A little magic.<br>A pet that\'s <em>all yours.</em>',heroDesc:'Turn your imagination into custom pet artwork. Design with our studio, then pay with transparent blockchain escrow.',
      explore:'Explore designs ↗',start:'Start a commission',testnet:'Demo project · Sepolia test ETH only · Not an NFT',
      galleryTitle:'Meet your next little companion',galleryDesc:'These are inspiration samples, not on-chain orders. Final design and price are discussed with the studio.',
      customTitle:'Tell us about your dream pet',customDesc:'Build a design brief and send it to our studio. Your request stays off-chain; no information is submitted to a server.',
      noteTitle:'Before payment',noteText:'Agree on the artwork, price and delivery time with the studio first. Then the studio creates a blockchain commission.',
      petType:'Pet type',artStyle:'Art style',mainColor:'Main color',accessories:'Accessories',special:'Special requests',prepare:'Prepare request',brief:'Your commission brief',copy:'Copy request',discord:'Contact via Discord',
      ordersTitle:'Your commission desk',ordersDesc:'Real orders are read from the deployed Sepolia smart contract. Any wallet can create an order; only the original buyer can confirm delivery.',
      wallet:'Wallet',network:'Network',count:'Orders',refresh:'Refresh',createTitle:'Create a commission',createDesc:'Studio wallet: create an order only after agreeing on the details with your customer.',
      orderName:'Commission name',price:'Price (test ETH)',createBtn:'Create on Sepolia',publicWarning:'Orders are public: the contract cannot reserve one for a specific customer.',
      all:'All',mine:'My orders',available:'Available',howTitle:'How PawCraft works',chainTitle:'A little art, backed by smart contracts',
      chainDesc:'The contract stores commission name, price, seller, buyer, payment timestamp and status. Artwork, briefs and Discord conversations stay off-chain.',
      limits:'Limitations: no artwork verification, no buyer-specific reservation, and refunds only after seven days in Paid status.',viewContract:'View smart contract ↗',noReal:'Test ETH has no real monetary value.',
      cardDesc:'Inspiration sample · final pricing by discussion',customizeCard:'Customize this style',stepTitles:['Explore designs','Prepare a request','Contact the studio','Create a commission','Pay with test ETH','Deliver artwork','Confirm & release'],
      stepDescs:['Browse inspiration artwork.','Describe your dream pet.','Agree on details and price via Discord.','Studio creates a public on-chain order.','Customer locks payment in the contract.','Studio sends artwork off-chain.','Buyer confirms and ETH is released.'],
      disconnected:'Not connected',notLoaded:'Connect MetaMask to load commissions.',wrongNetwork:'Wrong network — switch to Sepolia.',
      listed:'Available',paid:'Payment locked',completed:'Completed',cancelled:'Cancelled',refunded:'Refunded',
      seller:'Seller',buyer:'Buyer',priceLabel:'Price',created:'Commission',paidAt:'Paid at',noBuyer:'Not purchased',
      pay:'Pay & lock ETH',confirm:'Confirm artwork received',cancel:'Cancel listing',refund:'Request refund',
      sevenDays:'Refund available after',noOrders:'No commissions match this filter.',
      txPending:'Waiting for blockchain confirmation…',walletPending:'Confirm in MetaMask…',txConfirmed:'Transaction confirmed on Sepolia.',
      errorWallet:'Please install MetaMask (or another injected Ethereum wallet).',errorNetwork:'Switch to Ethereum Sepolia first.',
      errorAccount:'Connect your wallet first.',invalidPrice:'Enter a positive ETH price, for example 0.001.',invalidName:'Enter a commission name.',
      requestReady:'Request prepared. Copy it and send it through your studio contact.',copied:'Commission request copied.',
      noDiscord:'Studio Discord contact is not configured yet. Copy your request and arrange contact directly.',
      actionFailed:'Transaction was not completed.',largeOrderList:'Loading on-chain commissions…',
      readFailure:'Could not read contract data. Check the network and contract address.',
      pricePreview:'Test ETH',viewTx:'View transaction ↗',publicOrder:'Public order — verify the seller before paying.',
      due:'Eligible now',unknown:'Unknown',chooseFirst:'Choose this design',noData:'—'
    },
    zh: {
      navGallery:'作品展示',navCustomize:'定制宠物',navOrders:'链上订单',navHow:'如何使用',connect:'连接钱包',
      heroTitle:'一点点魔法，<br>一只<em>专属于你的宠物。</em>',heroDesc:'把想象变成专属数字宠物艺术作品。与工作室确认设计后，通过区块链托管付款。',
      explore:'浏览作品 ↗',start:'开始定制',testnet:'课程演示项目 · 仅使用 Sepolia 测试 ETH · 不是 NFT',
      galleryTitle:'认识你的下一位小伙伴',galleryDesc:'这里是设计灵感样品，不是链上订单。最终设计和价格需与工作室沟通确认。',
      customTitle:'描述你梦想中的宠物',customDesc:'填写并整理定制需求，再自行发送给工作室。需求保留在链下，本站不会将内容上传服务器。',
      noteTitle:'付款之前',noteText:'先与工作室确认作品细节、价格和交付时间，再由工作室创建链上订单。',
      petType:'宠物类型',artStyle:'艺术风格',mainColor:'主要颜色',accessories:'配饰',special:'特殊要求',prepare:'生成定制需求',brief:'你的定制需求',copy:'复制需求',discord:'通过 Discord 联系',
      ordersTitle:'订单管理',ordersDesc:'订单数据真实读取自 Sepolia 已部署的智能合约。任何钱包均可创建订单；只有买家可以确认交付。',
      wallet:'钱包',network:'网络',count:'订单数',refresh:'刷新',createTitle:'创建定制订单',createDesc:'工作室应先与客户确认设计和价格，再使用钱包创建订单。',
      orderName:'订单名称',price:'价格（测试 ETH）',createBtn:'在 Sepolia 创建订单',publicWarning:'订单是公开的：现有合约无法把订单保留给指定客户。',
      all:'全部',mine:'与我有关',available:'待付款',howTitle:'PawCraft 如何运作',chainTitle:'让小小艺术遇见智能合约',
      chainDesc:'合约记录订单名称、价格、卖家、买家、付款时间和状态。作品、定制需求和 Discord 聊天都在链下。',
      limits:'限制：合约无法验证作品、无法限制指定买家，且仅在已付款满七天后支持买家退款。',viewContract:'查看智能合约 ↗',noReal:'测试 ETH 不代表真实货币价值。',
      cardDesc:'设计样品 · 最终价格另行协商',customizeCard:'定制这种风格',stepTitles:['浏览作品','整理需求','联系工作室','创建订单','支付测试 ETH','交付作品','确认并放款'],
      stepDescs:['浏览宠物设计灵感。','描述你想要的宠物。','通过 Discord 确认细节和价格。','工作室创建公开链上订单。','客户将测试 ETH 锁定到合约。','工作室通过链下方式交付作品。','买家确认收货，ETH 释放给工作室。'],
      disconnected:'未连接',notLoaded:'连接 MetaMask 后加载订单。',wrongNetwork:'网络错误，请切换 Sepolia。',
      listed:'待付款',paid:'付款已锁定',completed:'已完成',cancelled:'已取消',refunded:'已退款',
      seller:'卖家',buyer:'买家',priceLabel:'价格',created:'订单',paidAt:'付款时间',noBuyer:'尚未购买',
      pay:'付款并锁定 ETH',confirm:'确认收到作品',cancel:'取消订单',refund:'申请退款',
      sevenDays:'可退款时间',noOrders:'没有符合筛选条件的订单。',
      txPending:'等待区块链确认…',walletPending:'请在 MetaMask 确认…',txConfirmed:'Sepolia 交易已确认。',
      errorWallet:'请先安装 MetaMask 或兼容的钱包扩展。',errorNetwork:'请先切换到 Ethereum Sepolia。',
      errorAccount:'请先连接钱包。',invalidPrice:'请输入大于零的 ETH 价格，例如 0.001。',invalidName:'请输入订单名称。',
      requestReady:'需求已整理完成，请复制后通过工作室联系方式发送。',copied:'定制需求已复制。',
      noDiscord:'尚未配置工作室 Discord 链接。请先复制需求，再自行联系工作室。',
      actionFailed:'交易未完成。',largeOrderList:'正在读取链上订单…',
      readFailure:'无法读取合约数据，请检查网络和合约地址。',
      pricePreview:'测试 ETH',viewTx:'查看交易 ↗',publicOrder:'公开订单，付款前务必核对卖家地址。',
      due:'现在可以退款',unknown:'未知',chooseFirst:'选择此设计',noData:'—'
    }
  };
  const t = key => locales[state.lang][key] || key;
  const trimAddress = address => address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—';
  const sameAddress = (a,b) => Boolean(a && b && a.toLowerCase() === b.toLowerCase());
  const ethersAvailable = () => typeof window.ethers !== 'undefined';
  const networkOK = async () => {
    if (!state.provider) return false;
    const net = await state.provider.getNetwork();
    return Number(net.chainId) === CHAIN_NUMBER;
  };
  function showToast(message) {
    const toast = $('toast'); toast.textContent = message; toast.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.hidden = true, 5500);
  }
  function errorMessage(error) {
    if (error?.code === 4001 || error?.code === 'ACTION_REJECTED') return state.lang === 'zh' ? '用户取消了钱包操作。' : 'Wallet request rejected.';
    let message = error?.shortMessage || error?.reason || error?.info?.error?.message || error?.message || String(error);
    if (message.length > 230) message = message.slice(0, 230) + '…';
    return message;
  }
  function setBusy(isBusy, message, hash='') {
    state.busy = isBusy;
    const overlay = $('busyOverlay'); overlay.hidden = !isBusy;
    $('busyText').textContent = message || t('walletPending');
    const link = $('busyLink'); link.hidden = !hash; if (hash) link.href = `${EXPLORER}/tx/${hash}`;
  }
  function galleryRender() {
    const target = $('galleryGrid'); target.replaceChildren();
    gallery.forEach(([emoji,name,style,bg]) => {
      const card = document.createElement('article'); card.className = 'design-card';
      const art = document.createElement('div'); art.className = 'design-art'; art.style.background = bg; art.textContent = emoji;
      const content = document.createElement('div'); content.className = 'design-info';
      const pill = document.createElement('div'); pill.className = 'pill'; pill.textContent = style.toUpperCase();
      const title = document.createElement('h3'); title.textContent = name;
      const desc = document.createElement('p'); desc.textContent = t('cardDesc');
      const button = document.createElement('button'); button.className = 'outline'; button.textContent = t('customizeCard');
      button.addEventListener('click', () => { $('artStyle').value = ['Cute','Pixel Art','Fantasy','Cartoon'].includes(style) ? style : 'Fantasy';
        $('petType').value = /Cat/i.test(name)?'Cat':/Puppy/i.test(name)?'Dog':/Dragon/i.test(name)?'Dragon':/Fox/i.test(name)?'Fox':/Bunny/i.test(name)?'Rabbit':'Other';
        location.hash = '#customize'; });
      content.append(pill,title,desc,button); card.append(art,content); target.append(card);
    });
  }
  function stepsRender() {
    $('stepsGrid').replaceChildren();
    t('stepTitles').forEach((title,i) => {
      const step = document.createElement('article'); step.className = 'step';
      const num = document.createElement('div'); num.className='num'; num.textContent = String(i+1).padStart(2,'0');
      const heading = document.createElement('h3'); heading.textContent = title;
      const desc = document.createElement('p'); desc.textContent = t('stepDescs')[i];
      step.append(num,heading,desc); $('stepsGrid').append(step);
    });
  }
  function applyLanguage() {
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => { const key=el.dataset.i18n;
      if (key === 'heroTitle') el.innerHTML = t(key); else el.textContent = t(key);
    });
    $('langBtn').textContent = state.lang === 'zh' ? 'English' : '中文';
    galleryRender(); stepsRender(); renderWallet(); renderOrders();
  }
  function renderWallet() {
    $('walletAddress').textContent = state.account || t('disconnected');
    $('connectBtn').textContent = state.account ? trimAddress(state.account) : t('connect');
    $('networkValue').textContent = state.account ? (state.contract ? 'Ethereum Sepolia' : t('wrongNetwork')) : '—';
    $('countValue').textContent = state.contract ? String(state.orders.length) : '—';
  }
  async function walletConnect(request = true) {
    if (!window.ethereum) throw new Error(t('errorWallet'));
    if (!ethersAvailable()) throw new Error('Ethers.js failed to load. Check your internet connection.');
    const accounts = await window.ethereum.request({ method: request ? 'eth_requestAccounts':'eth_accounts' });
    state.account = accounts?.[0] || '';
    if (!state.account) { state.provider=null;state.contract=null;state.orders=[];renderWallet();renderOrders();return; }
    let chain = await window.ethereum.request({method:'eth_chainId'});
    if (chain?.toLowerCase() !== CHAIN_ID && request) {
      try { await window.ethereum.request({ method:'wallet_switchEthereumChain',params:[{chainId:CHAIN_ID}] }); }
      catch (err) {
        if (err.code === 4902) await window.ethereum.request({method:'wallet_addEthereumChain',params:[{chainId:CHAIN_ID,chainName:'Sepolia',nativeCurrency:{name:'Sepolia ETH',symbol:'ETH',decimals:18},rpcUrls:['https://ethereum-sepolia-rpc.publicnode.com'],blockExplorerUrls:[EXPLORER]}]});
        else throw err;
      }
      chain = await window.ethereum.request({method:'eth_chainId'});
    }
    state.provider = new window.ethers.BrowserProvider(window.ethereum);
    state.contract = chain?.toLowerCase() === CHAIN_ID ? new window.ethers.Contract(CONTRACT_ADDRESS,ABI,state.provider) : null;
    if (!state.contract) { state.orders=[];renderWallet();renderOrders();if(request)throw new Error(t('errorNetwork'));return; }
    renderWallet(); await loadOrders();
  }
  async function loadOrders() {
    if (!state.contract) { renderOrders();return; }
    $('ordersList').textContent = t('largeOrderList');
    try {
      const count = Number(await state.contract.getItemCount());
      if (!Number.isSafeInteger(count) || count < 0) throw new Error('Invalid item count');
      const orders=[];
      // Read in modest batches to avoid RPC rate-limits on larger public contracts.
      for(let start=0;start<count;start+=12) {
        const batch=Array.from({length:Math.min(12,count-start)},(_,i)=>start+i);
        const result=await Promise.all(batch.map(async id => {
          const it=await state.contract.getItem(id);
          return {id,seller:it[0],buyer:it[1],name:it[2],price:it[3],paidAt:Number(it[4]),status:Number(it[5])};
        }));
        orders.push(...result);
      }
      state.orders=orders.reverse(); renderWallet();renderOrders();
    } catch(err) { state.orders=[];renderWallet();$('ordersList').textContent=t('readFailure');console.error(err);showToast(`${t('readFailure')} ${errorMessage(err)}`); }
  }
  function make(tag,cls,text) { const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e; }
  function detail(grid,label,value) { const e=make('div');e.append(make('span','',label),make('strong','',value));grid.append(e); }
  function action(buttons,label,fn) { const b=make('button','outline',label);b.type='button';b.addEventListener('click',fn);buttons.append(b); }
  function renderOrders() {
    const target=$('ordersList');target.replaceChildren();
    if (!state.contract) {target.append(make('div','empty',t('notLoaded')));return;}
    const visible=state.orders.filter(o => state.filter==='all' || (state.filter==='mine' && (sameAddress(o.seller,state.account)||sameAddress(o.buyer,state.account))) || (state.filter==='available' && o.status===0));
    if (!visible.length) {target.append(make('div','empty',t('noOrders')));return;}
    visible.forEach(order => {
      const statusKeys=['listed','paid','completed','cancelled','refunded'];
      const key=statusKeys[order.status]||'unknown';
      const card=make('article','order-card');
      const top=make('div','order-top');top.append(make('h3','',`#${order.id} · ${order.name}`),make('span',`tag ${key==='paid'?'paid':key==='listed'?'':key}`,t(key)));card.append(top);
      const meta=make('div','order-meta');detail(meta,t('seller'),trimAddress(order.seller));detail(meta,t('buyer'),order.status===0?t('noBuyer'):trimAddress(order.buyer));
      detail(meta,t('priceLabel'),`${window.ethers.formatEther(order.price)} ETH`);
      if(order.paidAt)detail(meta,t('paidAt'),new Date(order.paidAt*1000).toLocaleString(state.lang==='zh'?'zh-CN':'en-US'));
      card.append(meta);
      if(order.status===0)card.append(make('p','muted',t('publicOrder')));
      if(order.status===1 && sameAddress(order.buyer,state.account) && (Date.now()/1000)<order.paidAt+REFUND_SECONDS) {
        card.append(make('p','muted',`${t('sevenDays')}: ${new Date((order.paidAt+REFUND_SECONDS)*1000).toLocaleString(state.lang==='zh'?'zh-CN':'en-US')}`));
      }
      const buttons=make('div','order-actions');
      if(order.status===0 && !sameAddress(order.seller,state.account))action(buttons,t('pay'),()=>sendTransaction('buyItem',[order.id],{value:order.price}));
      if(order.status===0 && sameAddress(order.seller,state.account))action(buttons,t('cancel'),()=>sendTransaction('cancelItem',[order.id]));
      if(order.status===1 && sameAddress(order.buyer,state.account)) {
        action(buttons,t('confirm'),()=>sendTransaction('confirmReceipt',[order.id]));
        if(Date.now()/1000>=order.paidAt+REFUND_SECONDS)action(buttons,t('refund'),()=>sendTransaction('refund',[order.id]));
      }
      if(buttons.childElementCount)card.append(buttons);
      target.append(card);
    });
  }
  async function sendTransaction(method,args,overrides) {
    if(state.busy)return;
    try {
      if(!state.account)throw new Error(t('errorAccount'));
      if(!await networkOK())throw new Error(t('errorNetwork'));
      setBusy(true,t('walletPending'));
      const signer=await state.provider.getSigner();
      const contract=state.contract.connect(signer);
      const tx=overrides ? await contract[method](...args,overrides) : await contract[method](...args);
      setBusy(true,t('txPending'),tx.hash);
      const receipt=await tx.wait();
      if(!receipt || receipt.status!==1)throw new Error('Transaction reverted.');
      setBusy(false);showToast(t('txConfirmed'));
      await loadOrders();
      const a=make('a','tx-last-link',t('viewTx'));a.href=`${EXPLORER}/tx/${tx.hash}`;a.target='_blank';a.rel='noopener noreferrer';
      const toast=$('toast');toast.append(' ',a);toast.hidden=false;
    }catch(err) {setBusy(false);console.error(err);showToast(`${t('actionFailed')} ${errorMessage(err)}`);}
  }
  function initializeForms() {
    $('requestForm').addEventListener('submit',e=>{
      e.preventDefault();
      const type=$('petType').value,style=$('artStyle').value,color=$('mainColor').value.trim(),accessories=$('accessories').value.trim(),special=$('special').value.trim();
      $('briefOutput').value=`PawCraft Studio — Commission Request\nPet type: ${type}\nArt style: ${style}\nMain color: ${color||'To discuss'}\nAccessories: ${accessories||'None specified'}\nSpecial requests: ${special||'None specified'}\n\nPlease confirm the final price, delivery date and method with me before creating an on-chain order.\nThis brief is not stored on the blockchain.`;
      $('requestResult').hidden=false;showToast(t('requestReady'));
    });
    $('copyBtn').addEventListener('click',async()=>{
      try {await navigator.clipboard.writeText($('briefOutput').value);showToast(t('copied'));}
      catch { $('briefOutput').focus();$('briefOutput').select();showToast(state.lang==='zh'?'请手动复制已选中的文本。':'Select and manually copy the request.'); }
    });
    $('discordBtn').addEventListener('click',()=>{
      if(!DISCORD_URL) {showToast(t('noDiscord'));return;}
      window.open(DISCORD_URL,'_blank','noopener,noreferrer');
    });
    $('createForm').addEventListener('submit',async e=>{
      e.preventDefault();
      const name=$('orderName').value.trim(),priceText=$('orderPrice').value.trim();
      if(!name){showToast(t('invalidName'));return;}
      if(!/^\d+(\.\d{1,18})?$/.test(priceText)){showToast(t('invalidPrice'));return;}
      let wei;try{wei=window.ethers.parseEther(priceText);}catch{showToast(t('invalidPrice'));return;}
      if(wei<=0n){showToast(t('invalidPrice'));return;}
      await sendTransaction('listItem',[name,wei]);
    });
  }
  function initializeEvents() {
    $('langBtn').addEventListener('click',()=>{state.lang=state.lang==='en'?'zh':'en';applyLanguage();});
    $('connectBtn').addEventListener('click',async()=>{try{await walletConnect();}catch(e){showToast(errorMessage(e));}});
    $('refreshBtn').addEventListener('click',async()=>{try{if(!state.account) await walletConnect();else await loadOrders();}catch(e){showToast(errorMessage(e));}});
    document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
      state.filter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));renderOrders();
    }));
    if(window.ethereum?.on){
      window.ethereum.on('accountsChanged',()=>{walletConnect(false).catch(e=>showToast(errorMessage(e)));});
      window.ethereum.on('chainChanged',()=>{walletConnect(false).catch(e=>showToast(errorMessage(e)));});
    }
  }
  function init() {
    $('contractAddress').textContent=CONTRACT_ADDRESS;
    $('contractLink').href=`${EXPLORER}/address/${CONTRACT_ADDRESS}`;
    $('discordHint').textContent=DISCORD_URL?'':t('noDiscord');
    initializeEvents();initializeForms();applyLanguage();
    if(window.ethereum)walletConnect(false).catch(e=>console.warn('Silent wallet check:',e));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
