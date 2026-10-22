// Additive ticket-history layer for Budgetingwise Chat Support.
import{getApps,getApp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import{getAuth}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';
import{getFirestore,doc,getDoc,setDoc,collection,addDoc,serverTimestamp}from'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
const waitFor=(fn,limit=120)=>new Promise(resolve=>{let n=0;const t=setInterval(()=>{const v=fn();if(v||++n>=limit){clearInterval(t);resolve(v||null)}},100)});
const dbReady=()=>getApps().length?getFirestore(getApp()):null;

async function bindCustomer(){
 const button=await waitFor(()=>document.getElementById('bwNewTicket'));if(!button||button.dataset.ticketHistoryBound==='1')return;button.dataset.ticketHistoryBound='1';
 button.addEventListener('click',async()=>{try{const db=dbReady(),user=getApps().length?getAuth(getApp()).currentUser:null;if(!db||!user)return;const ref=doc(db,'supportThreads',user.uid),snap=await getDoc(ref),data=snap.exists()?snap.data():{},next=Math.max(1,Number(data.ticketNumber||1)+1);await setDoc(ref,{ticketNumber:next,previousTicketCount:next-1,lastTicketStartedAt:serverTimestamp(),updatedAt:serverTimestamp()},{merge:true});await addDoc(collection(db,'supportThreads',user.uid,'messages'),{sender:'system',system:true,ticketMarker:true,ticketNumber:next,text:`Support Ticket #${next}`,createdAt:serverTimestamp()})}catch(e){console.warn('Ticket history metadata unavailable:',e)}});
}

async function enhanceAdminProfile(){
 const profile=document.getElementById('aspProfile'),threads=document.getElementById('aspThreads');if(!profile||!threads)return;
 const refresh=async()=>{const active=threads.querySelector('[data-thread].active');if(!active||profile.querySelector('[data-ticket-history-info]'))return;try{const db=dbReady();if(!db)return;const snap=await getDoc(doc(db,'supportThreads',active.dataset.thread));if(!snap.exists())return;const t=snap.data(),total=Math.max(1,Number(t.ticketNumber||1)),previous=Math.max(0,Number(t.previousTicketCount??total-1));const card=profile.querySelector('.asp-profile-card');if(!card)return;const box=document.createElement('div');box.dataset.ticketHistoryInfo='1';box.style.cssText='margin-top:12px;padding:12px;border:1px solid #e7e3ff;border-radius:12px;background:#faf9ff';box.innerHTML=`<small style="display:block;color:#7b8298;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.05em">Chat history</small><strong style="display:block;margin-top:5px;color:#17182d;font-size:11px">${total} support ticket${total===1?'':'s'} · ${previous} previous</strong><button type="button" style="margin-top:9px;width:100%;border:1px solid #ded9ff;border-radius:9px;padding:8px;background:#fff;color:#5638dc;font:800 9px inherit;cursor:pointer">View previous chats</button>`;box.querySelector('button').onclick=()=>{const messages=document.getElementById('aspMessages');if(messages){messages.scrollTop=0;messages.animate?.([{opacity:.55},{opacity:1}],{duration:250})}};card.appendChild(box)}catch(e){console.warn('Unable to load chat history summary:',e)}};
 new MutationObserver(()=>setTimeout(refresh,40)).observe(profile,{childList:true,subtree:true});threads.addEventListener('click',()=>setTimeout(refresh,180));refresh();
}

if(document.getElementById('adminApp')||/^\/admin(?:\/|$)/i.test(location.pathname))enhanceAdminProfile();else bindCustomer();
