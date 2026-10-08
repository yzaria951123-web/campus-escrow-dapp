/* PawCraft Studio v1.2 — Sepolia frontend.
 * Role choice is UI only. Deployed contract listItem() is public.
 * IMPORTANT: This is a testnet demo; do not send real ETH.
 */
"use strict";
const STUDIO_WALLET = "0x79706e1C4bfa6B8a5EfC24431582ae8F155f8bcB";
const CONTRACT_ADDRESS = "0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A";
const SEPOLIA_CHAIN_ID = "0xaa36a7";
const SEPOLIA_CHAIN_DEC = 11155111;
const EXPLORER = "https://sepolia.etherscan.io";
const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";
const ABI = [
  "function listItem(string name,uint256 price)",
  "function buyItem(uint256 id) payable",
  "function confirmReceipt(uint256 id)",
  "function cancelItem(uint256 id)",
  "function refund(uint256 id)",
  "function getItemCount() view returns (uint256)",
  "function getItem(uint256 id) view returns (address seller,address buyer,string name,uint256 price,uint256 paidAt,uint8 status)"
];
/* IMPORTANT: If the deployed contract uses different status numbers, verify
 * against its verified Solidity source before relying on these labels. */
const STATUS = ["Listed", "Paid", "Completed", "Cancelled", "Refunded"];
const STYLE_DATA = [
  {name:"Kawaii Style",emoji:"🐱",en:"Soft colors, rounded shapes, and adorable expressions.",zh:"柔和配色、圆润造型和可爱的表情。"},
  {name:"Pixel Art",emoji:"👾",en:"Retro pixel designs inspired by classic video games.",zh:"经典电子游戏风格的复古像素艺术。"},
  {name:"Fantasy Style",emoji:"🐉",en:"Magical creatures, fantasy outfits, and enchanting details.",zh:"魔法生物、奇幻服装和充满想象力的细节。"},
  {name:"Chibi Style",emoji:"🐰",en:"Cute miniature characters with playful proportions.",zh:"Q版迷你角色，拥有活泼可爱的造型比例。"},
  {name:"Watercolor Style",emoji:"🎨",en:"Gentle brush textures, soft gradients, and dreamy colors.",zh:"柔和的笔触、自然渐变和梦幻色彩。"},
  {name:"Cartoon Style",emoji:"🦊",en:"Clean outlines, expressive faces, and vibrant colors.",zh:"清晰的轮廓、丰富的表情和鲜明的色彩。"}
];
const STEPS = [
  ["Choose a Style","Select your favorite art style and describe your pet.","选择风格","选择喜欢的艺术风格并描述你的宠物。"],
  ["Discuss with Studio","Copy your request and contact the studio on Discord to agree on price and delivery.","联系工作室","复制定制需求，通过 Discord 与工作室确认价格和交付。"],
  ["Pay via Escrow","Find the studio's commission ID and pay Sepolia test ETH to the contract.","托管付款","使用工作室提供的订单编号，通过合约支付 Sepolia 测试 ETH。"],
  ["Receive & Confirm","Receive the artwork off-chain and confirm receipt to release escrow.","收货并确认","在线下收到作品后确认收货，合约向工作室释放托管款项。"]
];
const I18N = {
  en:{
    navHome:"Home",navGallery:"Art Styles",navCustomize:"Customize",navOrders:"My Orders",navHow:"How It Works",
    navDashboard:"Dashboard",navCreatePayment:"Create Payment Request",navManageOrders:"Manage Orders",
    connect:"Connect Wallet",switchRole:"Switch Role",welcomeTitle:"Welcome to PawCraft",welcomeSubtitle:"Create Your Dream Virtual Pet.",
    chooseRole:"How would you like to continue?",creatorRole:"I'm a Creator",creatorRoleDesc:"Manage studio commissions and payment requests.",
    enterCreator:"Enter Creator Studio →",customerRole:"I'm a Customer",customerRoleDesc:"Explore art styles and design your dream pet.",
    enterCustomer:"Explore PawCraft →",roleNotice:"Choosing a role changes the interface, not blockchain permissions. Test ETH only.",
    heroTitle:"A little magic. A pet that's all yours.",heroDesc:"Choose an art style, discuss your commission with our studio, and pay through transparent blockchain escrow.",
    explore:"Explore art styles ↗",start:"Customize your pet",testnet:"Sepolia test ETH only · Artwork is not an NFT",
    galleryTitle:"Explore Our Art Styles",galleryDesc:"Choose your favorite art style and create a pet that is uniquely yours.",
    styleButton:"Customize in This Style",customTitle:"Customize Your Pet",
    customDesc:"Prepare a detailed commission request, then discuss the final design, price and delivery time with PawCraft Studio on Discord.",
    noteTitle:"Before payment",noteText:"Your customization details are not stored on-chain. The studio creates a payment request only after you agree on the service.",
    petType:"Pet Type",artStyle:"Art Style",mainColor:"Main Color",accessories:"Accessories",personality:"Pet Personality",
    background:"Background",discordUsername:"Discord Username",special:"Special Requests",prepare:"Generate Commission Request",
    brief:"Your Commission Request",copy:"Copy Request",discord:"Contact Studio on Discord",
    customerOrdersTitle:"Find Your Commission",customerOrdersDesc:"Enter the commission ID given to you by PawCraft Studio. Check the official studio address and price before paying.",
    commissionId:"Commission ID",findCommission:"Find Commission",myPaidOrders:"My Paid Commissions",
    howTitle:"How PawCraft Works",creatorDashboardTitle:"Studio Dashboard",
    creatorDashboardDesc:"Manage commission payments using the official PawCraft Studio wallet.",
    creatorRestricted:"Creator Access Restricted",
    creatorRestrictedDesc:"Connect the official PawCraft Studio wallet to create and manage payment requests.",
    totalCommissions:"Total Commissions",awaitingPayment:"Awaiting Payment",inProgress:"In Progress",completed:"Completed",
    createTitle:"Create Payment Request",createDesc:"Create a payment request only after agreeing on the artwork, price and delivery time with your customer.",
    orderName:"Commission Name",price:"Price (test ETH)",createBtn:"Create Payment Request",
    publicWarning:"The contract does not reserve a commission for a specific buyer. Share its ID privately and verify details.",
    manageOrdersTitle:"Manage Studio Orders",chainTitle:"Transparent Blockchain Payments",
    chainDesc:"The contract records commission name, price, seller, buyer, payment time and status. Artwork and customization details stay off-chain.",
    limits:"The smart contract cannot verify artwork quality or restrict payment to a chosen buyer. Refund rules are enforced by the deployed contract.",
    wallet:"Wallet",network:"Network",count:"Orders",refresh:"Refresh",viewContract:"View Smart Contract ↗",
    noReal:"Sepolia test ETH has no real monetary value.",
    notConnected:"Not connected",empty:"No matching commissions found.",connectFirst:"Connect MetaMask to continue.",
    wrongNetwork:"Please switch to Ethereum Sepolia.",studioOnly:"Only the official studio wallet can create payment requests.",
    creatorAccess:"Official studio wallet connected. Creator tools enabled.",lookup:"Looking up commission...",
    loading:"Loading blockchain data...",notOfficial:"This commission was not created by the official PawCraft Studio wallet.",
    notFound:"Commission not found.",notForSale:"This commission is no longer awaiting payment.",
    pay:"Pay & Lock Test ETH",confirm:"Confirm Artwork Received",cancel:"Cancel Unpaid Request",refund:"Request Refund",
    seller:"Creator",buyer:"Buyer",status:"Status",priceLabel:"Price",commission:"Commission",id:"ID",
    actionSuccess:"Transaction confirmed.",requestReady:"Commission request ready. Copy it and contact the studio.",
    copied:"Commission request copied.",noDiscord:"Studio Discord link has not been configured. Copy your request and contact the studio using its published Discord details.",
    invalidPrice:"Enter a positive ETH amount.",walletUnavailable:"MetaMask was not found. Install or enable MetaMask to transact.",
    cancelled:"Transaction cancelled or failed.",connectStudio:"Connect the official studio wallet to use creator actions.",
    verify:"Verify the commission name, price, and studio wallet before paying. Commission IDs are public, not passwords.",
    notYourOrder:"Only the paying wallet can confirm receipt or request a refund.",
    refundRule:"Refund availability is determined by the deployed smart contract (including any waiting period).",
    txPending:"Confirm the transaction in MetaMask. Then wait for blockchain confirmation...",
    chainUnavailable:"Could not read Sepolia right now. Check the RPC/network and retry.",
    refreshOrders:"Refresh orders",connected:"Connected",wrongStudio:"The connected wallet is not the official creator wallet.",
    switchSepolia:"Switch to Sepolia",newRequest:"Payment request created. Check the latest order ID in Studio Orders.",
    copyFailed:"Clipboard unavailable. Select and copy the request text manually.",
    discordHint:"Your browser will open the studio's Discord link if configured."
  },
  zh:{
    navHome:"首页",navGallery:"艺术风格",navCustomize:"定制宠物",navOrders:"我的订单",navHow:"使用流程",
    navDashboard:"工作室概览",navCreatePayment:"创建付款订单",navManageOrders:"管理订单",
    connect:"连接钱包",switchRole:"切换身份",welcomeTitle:"欢迎来到 PawCraft",welcomeSubtitle:"创造你的专属虚拟宠物。",
    chooseRole:"你想以什么身份继续？",creatorRole:"我是创作者",creatorRoleDesc:"管理工作室定制订单与收款请求。",
    enterCreator:"进入创作者工作室 →",customerRole:"我是消费者",customerRoleDesc:"探索艺术风格，定制专属虚拟宠物。",
    enterCustomer:"开始定制 →",roleNotice:"选择身份仅改变网站界面，不改变链上权限。仅使用测试 ETH。",
    heroTitle:"一点魔法，一只专属于你的宠物。",heroDesc:"选择艺术风格，与工作室沟通定制需求，通过透明的区块链托管付款。",
    explore:"探索艺术风格 ↗",start:"定制我的宠物",testnet:"仅使用 Sepolia 测试 ETH · 作品不是 NFT",
    galleryTitle:"探索我们的艺术风格",galleryDesc:"选择喜欢的艺术风格，创作独一无二的宠物。",
    styleButton:"选择此风格定制",customTitle:"定制你的宠物",
    customDesc:"填写完整的定制需求，再通过 Discord 与 PawCraft Studio 确认设计、价格及交付时间。",
    noteTitle:"付款前须知",noteText:"定制信息不会写入区块链。双方确认服务内容后，工作室才会创建付款订单。",
    petType:"宠物类型",artStyle:"艺术风格",mainColor:"主要颜色",accessories:"配饰",personality:"宠物性格",
    background:"背景设计",discordUsername:"Discord 用户名",special:"特殊要求",prepare:"生成定制需求",
    brief:"你的定制需求",copy:"复制需求",discord:"通过 Discord 联系工作室",
    customerOrdersTitle:"查找你的定制订单",customerOrdersDesc:"输入工作室提供的订单编号。付款前核对官方工作室地址及金额。",
    commissionId:"订单编号",findCommission:"查找订单",myPaidOrders:"我已付款的订单",
    howTitle:"PawCraft 如何运作",creatorDashboardTitle:"工作室管理面板",
    creatorDashboardDesc:"使用 PawCraft Studio 官方钱包管理定制付款订单。",
    creatorRestricted:"创作者权限受限",creatorRestrictedDesc:"请连接 PawCraft Studio 官方钱包，才能创建和管理付款订单。",
    totalCommissions:"订单总数",awaitingPayment:"等待付款",inProgress:"进行中",completed:"已完成",
    createTitle:"创建付款订单",createDesc:"只有在与客户确认作品、价格和交付时间后才创建付款订单。",
    orderName:"定制订单名称",price:"价格（测试 ETH）",createBtn:"创建付款订单",
    publicWarning:"原合约无法指定唯一买家。请私下发送订单编号，并提醒客户核对订单信息。",
    manageOrdersTitle:"管理工作室订单",chainTitle:"透明的区块链付款",
    chainDesc:"合约记录订单名称、价格、卖家、买家、付款时间和状态。作品与定制需求保存在链下。",
    limits:"智能合约无法验证作品质量，也无法将付款限定给指定买家。退款规则由已部署的合约执行。",
    wallet:"钱包",network:"网络",count:"订单数",refresh:"刷新",viewContract:"查看智能合约 ↗",
    noReal:"Sepolia 测试 ETH 不具有真实货币价值。",
    notConnected:"未连接",empty:"没有找到符合条件的订单。",connectFirst:"请先连接 MetaMask。",
    wrongNetwork:"请切换到 Ethereum Sepolia 网络。",studioOnly:"只有官方工作室钱包才能通过网站创建付款订单。",
    creatorAccess:"已连接官方工作室钱包，可以使用创作者功能。",lookup:"正在查找订单……",
    loading:"正在读取区块链数据……",notOfficial:"该订单不是 PawCraft Studio 官方钱包创建的。",
    notFound:"未找到该订单。",notForSale:"该订单已不处于待付款状态。",
    pay:"支付并托管测试 ETH",confirm:"确认收到作品",cancel:"取消未付款订单",refund:"申请退款",
    seller:"创作者",buyer:"买家",status:"状态",priceLabel:"价格",commission:"定制订单",id:"编号",
    actionSuccess:"交易已确认。",requestReady:"定制需求已生成，请复制并联系工作室。",
    copied:"定制需求已复制。",noDiscord:"尚未配置工作室 Discord 链接。请复制需求，并通过工作室公布的 Discord 联系方式沟通。",
    invalidPrice:"请输入大于零的 ETH 金额。",walletUnavailable:"未检测到 MetaMask，请安装或启用 MetaMask 后交易。",
    cancelled:"交易已取消或失败。",connectStudio:"请连接官方工作室钱包以使用创作者功能。",
    verify:"付款前核对订单名称、价格和工作室钱包。订单编号是公开信息，不是密码。",
    notYourOrder:"只有实际付款的钱包才能确认收货或申请退款。",
    refundRule:"退款资格由已部署的智能合约决定，包括可能存在的等待期。",
    txPending:"请在 MetaMask 确认交易，并等待区块链确认……",
    chainUnavailable:"暂时无法读取 Sepolia，请检查网络或 RPC 后重试。",
    refreshOrders:"刷新订单",connected:"已连接",wrongStudio:"当前钱包不是官方创作者钱包。",
    switchSepolia:"切换至 Sepolia",newRequest:"付款订单已创建。请在工作室订单列表查看最新编号。",
    copyFailed:"无法自动复制，请手动选择并复制文本。",discordHint:"如已配置工作室 Discord 链接，浏览器将打开该链接。"
  }
};
/* Set a real Discord invite or profile URL before enabling the contact button.
 * Example: https://discord.gg/YOUR_INVITE (do not publish a placeholder). */
const STUDIO_DISCORD_URL = "";
const $ = id => document.getElementById(id);
let lang = localStorage.getItem("pawcraft_lang") === "zh" ? "zh" : "en";
let role = null;
let wallet = "";
let browserProvider = null;
let readProvider = null;
let contractRead = null;
let knownOrders = [];
let foundOrder = null;
let busy = false;
const t = key => (I18N[lang] && I18N[lang][key]) || key;
const studioWallet = a => !!a && a.toLowerCase() === STUDIO_WALLET.toLowerCase();
const same = (a,b) => !!a && !!b && a.toLowerCase() === b.toLowerCase();
const safe = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const short = a => a ? `${a.slice(0,6)}...${a.slice(-4)}` : t("notConnected");
const statusName = n => STATUS[Number(n)] || `Status ${n}`;
const eth = amount => window.ethers.formatEther(amount);
const contractUrl = `${EXPLORER}/address/${CONTRACT_ADDRESS}`;
function toast(message) {
  const el=$("toast");el.textContent=message;el.hidden=false;
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,6500);
}
function setBusy(value, message) {
  busy=value;
  $("busyOverlay").hidden=!value;
  $("busyText").textContent=message||t("txPending");
}
function showRole(next) {
  role=next;
  $("welcome").hidden=!!next;
  $("customerView").hidden=next!=="customer";
  $("creatorView").hidden=next!=="creator";
  $("customerNav").hidden=next!=="customer";
  $("creatorNav").hidden=next!=="creator";
  $("switchRoleBtn").hidden=!next;
  updateCreatorAccess();
  if(next==="creator") renderCreatorOrders();
  if(next==="customer") renderCustomerOrders();
  location.hash=next==="creator"?"#creatorDashboard":next==="customer"?"#customerHome":"#welcome";
}
function applyLanguage() {
  document.documentElement.lang=lang==="zh"?"zh-CN":"en";
  $("langBtn").textContent=lang==="en"?"中文":"EN";
  for(const node of document.querySelectorAll("[data-i18n]")) {
    const value=t(node.dataset.i18n);
    if(node.dataset.i18n==="heroTitle") {
      node.innerHTML=lang==="en"?'A little magic.<br>A pet that\'s <em>all yours.</em>':'一点魔法。<br>一只<em>专属于你</em>的宠物。';
    } else node.textContent=value;
  }
  $("connectBtn").textContent=wallet?short(wallet):t("connect");
  $("walletAddress").textContent=wallet||t("notConnected");
  $("networkValue").textContent=wallet?"Ethereum Sepolia":t("notConnected");
  renderGallery();renderSteps();renderCreatorOrders();renderCustomerOrders();
  if(foundOrder) renderFoundOrder(foundOrder);
  updateCreatorAccess();
}
function renderGallery() {
  $("galleryGrid").innerHTML=STYLE_DATA.map((s,i)=>`
    <article class="gallery-card">
      <div class="gallery-art" aria-hidden="true">${s.emoji}</div>
      <div class="gallery-body">
        <h3>${safe(s.name)}</h3>
        <p>${safe(lang==="zh"?s.zh:s.en)}</p>
        <button class="outline style-choice" data-style="${i}" type="button">${safe(t("styleButton"))}</button>
      </div>
    </article>`).join("");
  for(const btn of document.querySelectorAll(".style-choice")) {
    btn.addEventListener("click",()=>{
      $("artStyle").value=STYLE_DATA[Number(btn.dataset.style)].name;
      location.hash="#customize";
    });
  }
}
function renderSteps() {
  $("stepsGrid").innerHTML=STEPS.map((s,i)=>`
    <article class="step"><span class="num">${i+1}</span>
    <h3>${safe(lang==="zh"?s[2]:s[0])}</h3>
    <p>${safe(lang==="zh"?s[3]:s[1])}</p></article>`).join("");
}
function makeRequest(event) {
  event.preventDefault();
  const fields=[
    ["Pet Type","petType"],["Art Style","artStyle"],["Main Color","mainColor"],
    ["Accessories","accessories"],["Pet Personality","personality"],["Background","background"],
    ["Discord Username","discordUsername"],["Special Requests","special"]
  ];
  const content=["PawCraft Studio — Commission Request","",
    ...fields.map(([label,id])=>`${label}: ${$(id).value.trim()||"Not specified"}`),
    "","Price and delivery: To be discussed with PawCraft Studio.",
    "Payment: Sepolia test ETH via PawCraft escrow after studio creates an order."
  ].join("\n");
  $("briefOutput").value=content;
  $("requestResult").hidden=false;
  toast(t("requestReady"));
  $("requestResult").scrollIntoView({behavior:"smooth",block:"nearest"});
}
async function copyRequest() {
  const text=$("briefOutput").value;
  try {await navigator.clipboard.writeText(text);toast(t("copied"));}
  catch { $("briefOutput").focus();$("briefOutput").select();toast(t("copyFailed")); }
}
function openDiscord() {
  if(!STUDIO_DISCORD_URL){toast(t("noDiscord"));return;}
  try {
    const url=new URL(STUDIO_DISCORD_URL);
    if(url.protocol!=="https:")throw Error("Invalid URL");
    window.open(url.href,"_blank","noopener,noreferrer");
  }catch{toast(t("noDiscord"));}
}
function updateCreatorAccess() {
  const authorized=studioWallet(wallet);
  $("creatorAccessNotice").hidden=authorized;
  $("createBtn")?.setAttribute("aria-disabled",String(!authorized));
  const btn=$("createForm").querySelector('button[type="submit"]');
  btn.disabled=!authorized||busy;
  if(authorized) $("creatorAccessNotice").hidden=true;
}
function initRead() {
  if(!window.ethers)throw Error("Ethers.js could not load.");
  readProvider=new ethers.JsonRpcProvider(SEPOLIA_RPC,SEPOLIA_CHAIN_DEC,{staticNetwork:true});
  contractRead=new ethers.Contract(CONTRACT_ADDRESS,ABI,readProvider);
}
async function connectWallet() {
  if(!window.ethereum){toast(t("walletUnavailable"));return;}
  try {
    const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
    if(!accounts.length)return;
    const chain=await window.ethereum.request({method:"eth_chainId"});
    if(chain.toLowerCase()!==SEPOLIA_CHAIN_ID){
      try {
        await window.ethereum.request({method:"wallet_switchEthereumChain",params:[{chainId:SEPOLIA_CHAIN_ID}]});
      }catch(e){
        if(e.code===4902){
          await window.ethereum.request({method:"wallet_addEthereumChain",params:[{
            chainId:SEPOLIA_CHAIN_ID,chainName:"Sepolia",
            nativeCurrency:{name:"Sepolia ETH",symbol:"ETH",decimals:18},
            rpcUrls:[SEPOLIA_RPC],blockExplorerUrls:[EXPLORER]
          }]});
        }else throw e;
      }
    }
    browserProvider=new ethers.BrowserProvider(window.ethereum);
    wallet=ethers.getAddress(accounts[0]);
    $("connectBtn").textContent=short(wallet);
    $("walletAddress").textContent=wallet;
    $("networkValue").textContent="Ethereum Sepolia";
    updateCreatorAccess();renderCustomerOrders();renderCreatorOrders();
    toast(`${t("connected")}: ${short(wallet)}`);
    await loadOrders();
  }catch(e){toast(humanError(e));}
}
async function checkExistingWallet() {
  if(!window.ethereum)return;
  try{
    const accounts=await window.ethereum.request({method:"eth_accounts"});
    const chain=await window.ethereum.request({method:"eth_chainId"});
    if(accounts.length && chain.toLowerCase()===SEPOLIA_CHAIN_ID){
      browserProvider=new ethers.BrowserProvider(window.ethereum);
      wallet=ethers.getAddress(accounts[0]);
    }else wallet="";
  }catch{wallet="";}
  applyLanguage();
}
function humanError(e){
  if(e?.code===4001||e?.code==="ACTION_REJECTED")return t("cancelled");
  const msg=e?.shortMessage||e?.reason||e?.message||String(e);
  return msg.length>190?msg.slice(0,190)+"…":msg;
}
async function signerContract() {
  if(!window.ethereum)throw Error(t("walletUnavailable"));
  if(!wallet)throw Error(t("connectFirst"));
  const chain=await window.ethereum.request({method:"eth_chainId"});
  if(chain.toLowerCase()!==SEPOLIA_CHAIN_ID)throw Error(t("wrongNetwork"));
  browserProvider=new ethers.BrowserProvider(window.ethereum);
  const signer=await browserProvider.getSigner();
  if(!same(await signer.getAddress(),wallet))throw Error(t("connectFirst"));
  return new ethers.Contract(CONTRACT_ADDRESS,ABI,signer);
}
function decodeOrder(id,data) {
  return {
    id:Number(id),seller:String(data.seller??data[0]),buyer:String(data.buyer??data[1]),
    name:String(data.name??data[2]),price:BigInt(data.price??data[3]),
    paidAt:BigInt(data.paidAt??data[4]),status:Number(data.status??data[5])
  };
}
async function loadOrders() {
  try{
    if(!contractRead)initRead();
    $("countValue").textContent="…";
    const count=Number(await contractRead.getItemCount());
    $("countValue").textContent=String(count);
    /* Contract IDs may start at 0 or 1. Try both boundaries and skip reverts.
       For a small course demo, reads are batched in chunks to avoid RPC overload. */
    const ids=Array.from({length:count+1},(_,i)=>i);
    const results=[];
    for(let i=0;i<ids.length;i+=8){
      const batch=await Promise.all(ids.slice(i,i+8).map(async id=>{
        try {return decodeOrder(id,await contractRead.getItem(id));}
        catch{return null;}
      }));
      results.push(...batch.filter(Boolean));
    }
    /* An invalid default struct may be returned for unused IDs; exclude zero seller. */
    knownOrders=results.filter(o=>o.seller!==ethers.ZeroAddress);
    renderCreatorOrders();renderCustomerOrders();
    if(foundOrder){
      const updated=knownOrders.find(o=>o.id===foundOrder.id);
      if(updated){foundOrder=updated;renderFoundOrder(updated);}
    }
  }catch(e){
    $("countValue").textContent="—";
    toast(`${t("chainUnavailable")} ${humanError(e)}`);
  }
}
function orderMarkup(o,buttons="") {
  return `<article class="order-card">
    <div class="row"><h3>#${o.id} · ${safe(o.name)}</h3><span class="status-pill">${safe(statusName(o.status))}</span></div>
    <div class="order-meta">
      <p><b>${t("priceLabel")}:</b> ${safe(eth(o.price))} test ETH</p>
      <p><b>${t("seller")}:</b> <span class="mono">${safe(short(o.seller))}</span></p>
      <p><b>${t("buyer")}:</b> <span class="mono">${safe(o.buyer===ethers.ZeroAddress?"—":short(o.buyer))}</span></p>
      <p><b>${t("id")}:</b> ${o.id}</p>
    </div>
    ${buttons?`<div class="row">${buttons}</div>`:""}
  </article>`;
}
function actionButton(action,id,label) {
  return `<button type="button" class="outline order-action" data-action="${safe(action)}" data-id="${id}">${safe(label)}</button>`;
}
function renderCreatorOrders() {
  const host=$("creatorOrdersList");
  if(!host)return;
  if(!studioWallet(wallet)){
    host.innerHTML=`<p>${safe(t("connectStudio"))}</p>`;
    ["studioTotal","studioAvailable","studioPaid","studioCompleted"].forEach(id=>$(id).textContent="—");
    return;
  }
  const orders=knownOrders.filter(o=>studioWallet(o.seller)).sort((a,b)=>b.id-a.id);
  $("studioTotal").textContent=orders.length;
  $("studioAvailable").textContent=orders.filter(o=>o.status===0).length;
  $("studioPaid").textContent=orders.filter(o=>o.status===1).length;
  $("studioCompleted").textContent=orders.filter(o=>o.status===2).length;
  host.innerHTML=orders.length?orders.map(o=>orderMarkup(o,o.status===0?actionButton("cancel",o.id,t("cancel")):"")).join(""):`<p>${safe(t("empty"))}</p>`;
}
function renderCustomerOrders() {
  const host=$("customerOrdersList");
  if(!host)return;
  if(!wallet){host.innerHTML=`<p>${safe(t("connectFirst"))}</p>`;return;}
  const orders=knownOrders.filter(o=>studioWallet(o.seller)&&same(o.buyer,wallet)).sort((a,b)=>b.id-a.id);
  host.innerHTML=orders.length?orders.map(o=>{
    let actions="";
    if(o.status===1){
      actions=actionButton("confirm",o.id,t("confirm"))+" "+actionButton("refund",o.id,t("refund"));
    }
    return orderMarkup(o,actions);
  }).join(""):`<p>${safe(t("empty"))}</p>`;
}
async function findCommission(event) {
  event.preventDefault();
  const raw=$("commissionIdInput").value.trim();
  if(!/^\d+$/.test(raw)||!Number.isSafeInteger(Number(raw))){toast(t("notFound"));return;}
  const id=Number(raw);
  $("foundCommission").textContent=t("lookup");
  try {
    if(!contractRead)initRead();
    const order=decodeOrder(id,await contractRead.getItem(id));
    if(order.seller===ethers.ZeroAddress)throw Error(t("notFound"));
    foundOrder=order;renderFoundOrder(order);
  }catch(e){
    foundOrder=null;$("foundCommission").textContent=t("notFound");
  }
}
function renderFoundOrder(o) {
  const host=$("foundCommission");
  if(!studioWallet(o.seller)){
    host.innerHTML=`<div class="note"><b>${safe(t("notOfficial"))}</b></div>`;
    return;
  }
  let buttons="";
  if(o.status===0 && wallet && !same(wallet,o.seller)){
    buttons=actionButton("pay",o.id,`${t("pay")} · ${eth(o.price)} ETH`);
  }else if(o.status===1 && same(wallet,o.buyer)){
    buttons=actionButton("confirm",o.id,t("confirm"))+" "+actionButton("refund",o.id,t("refund"));
  }
  host.innerHTML=`<p class="micro">${safe(t("verify"))}</p>${orderMarkup(o,buttons)}`;
}
async function executeAction(action,id) {
  if(busy)return;
  const order=knownOrders.find(o=>o.id===id)||foundOrder?.id===id&&foundOrder;
  if(!order){toast(t("notFound"));return;}
  if(!studioWallet(order.seller)){toast(t("notOfficial"));return;}
  if(!wallet){toast(t("connectFirst"));return;}
  if(action==="cancel" && (!studioWallet(wallet)||order.status!==0)){toast(t("studioOnly"));return;}
  if(action==="pay" && (order.status!==0||same(wallet,order.seller))){toast(t("notForSale"));return;}
  if(["confirm","refund"].includes(action) && (order.status!==1||!same(wallet,order.buyer))){
    toast(t("notYourOrder"));return;
  }
  try{
    const contract=await signerContract();
    setBusy(true,t("txPending"));
    let tx;
    if(action==="pay"){
      // Re-read immediately before payment: IDs are public and anyone may pay first.
      const current=decodeOrder(id,await contract.getItem(id));
      if(!studioWallet(current.seller)||current.status!==0)throw Error(t("notForSale"));
      tx=await contract.buyItem(id,{value:current.price});
    }else if(action==="confirm")tx=await contract.confirmReceipt(id);
    else if(action==="cancel")tx=await contract.cancelItem(id);
    else if(action==="refund")tx=await contract.refund(id);
    else throw Error("Unknown action");
    $("busyLink").href=`${EXPLORER}/tx/${tx.hash}`;
    $("busyLink").hidden=false;
    await tx.wait();
    toast(t("actionSuccess"));
    await loadOrders();
  }catch(e){toast(humanError(e));}
  finally{$("busyLink").hidden=true;setBusy(false);updateCreatorAccess();}
}
async function createPayment(event) {
  event.preventDefault();
  if(busy)return;
  if(!studioWallet(wallet)){toast(t("studioOnly"));return;}
  const name=$("orderName").value.trim();
  const priceText=$("orderPrice").value.trim();
  if(!name||name.length>100){toast(t("invalidPrice"));return;}
  let amount;
  try{amount=ethers.parseEther(priceText);if(amount<=0n)throw Error();}
  catch{toast(t("invalidPrice"));return;}
  try{
    const contract=await signerContract();
    if(!studioWallet(await (await browserProvider.getSigner()).getAddress()))throw Error(t("studioOnly"));
    setBusy(true,t("txPending"));
    const tx=await contract.listItem(name,amount);
    $("busyLink").href=`${EXPLORER}/tx/${tx.hash}`;
    $("busyLink").hidden=false;
    await tx.wait();
    $("createForm").reset();
    toast(t("newRequest"));
    await loadOrders();
    location.hash="#creatorOrders";
  }catch(e){toast(humanError(e));}
  finally{$("busyLink").hidden=true;setBusy(false);updateCreatorAccess();}
}
function bind() {
  $("chooseCreatorBtn").addEventListener("click",()=>showRole("creator"));
  $("chooseCustomerBtn").addEventListener("click",()=>showRole("customer"));
  $("switchRoleBtn").addEventListener("click",()=>showRole(null));
  $("brandLink").addEventListener("click",e=>{e.preventDefault();showRole(null);});
  $("langBtn").addEventListener("click",()=>{
    lang=lang==="en"?"zh":"en";
    localStorage.setItem("pawcraft_lang",lang);
    applyLanguage();
  });
  $("connectBtn").addEventListener("click",connectWallet);
  $("refreshBtn").addEventListener("click",loadOrders);
  $("requestForm").addEventListener("submit",makeRequest);
  $("copyBtn").addEventListener("click",copyRequest);
  $("discordBtn").addEventListener("click",openDiscord);
  $("findCommissionForm").addEventListener("submit",findCommission);
  $("createForm").addEventListener("submit",createPayment);
  document.addEventListener("click",event=>{
    const btn=event.target.closest(".order-action");
    if(btn)executeAction(btn.dataset.action,Number(btn.dataset.id));
  });
  if(window.ethereum){
    window.ethereum.on?.("accountsChanged",async()=>{
      await checkExistingWallet();
      foundOrder=null;$("foundCommission").innerHTML="";
      renderCreatorOrders();renderCustomerOrders();
    });
    window.ethereum.on?.("chainChanged",async()=>{
      await checkExistingWallet();
      renderCreatorOrders();renderCustomerOrders();
    });
  }
}
async function main(){
  $("contractAddress").textContent=CONTRACT_ADDRESS;
  $("contractLink").href=contractUrl;
  bind();applyLanguage();showRole(null);
  await checkExistingWallet();
  await loadOrders();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",main);
else main();
