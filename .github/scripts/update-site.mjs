// Publish generated public files only, and refuse any original repository target.
// Pushing this file starts Deploy BCH Blaze website, which builds the current blaze2026 commit.
import {cp,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const [input,target]=process.argv.slice(2).map(p=>resolve(p));
if(!input||!target||input===target)throw Error('Distinct build and website directories required');
const remote=execFileSync('git',['-C',target,'remote','get-url','origin'],{encoding:'utf8'}).trim();
if(!/^https:\/\/github\.com\/staking-arena-blaze2026\/staking-arena-blaze-site(?:\.git)?$/.test(remote))throw Error('Refusing to publish outside the native hackathon website fork');
if(!/^[0-9a-f]{40}$/.test(process.env.SOURCE_SHA??''))throw Error('Exact source SHA required');
const files=await readdir(input);
if(!files.includes('index.html')||!files.includes('assets')||!files.includes('v3-vaults.json')||!files.includes('v3-vaults-mainnet.json')||files.some(p=>!['index.html','arena.svg','v3-vaults.json','v3-vaults-mainnet.json','assets'].includes(p)))throw Error('Unexpected public build contents');
const html=await readFile(join(input,'index.html'),'utf8');
if(!html.includes('/staking-arena-blaze-site/assets/'))throw Error('Wrong Pages project base');
await rm(join(target,'assets'),{recursive:true,force:true});
for(const name of files)await cp(join(input,name),join(target,name),{recursive:true});
await writeFile(join(target,'.nojekyll'),'');
const assets=[];
async function inventory(dir,prefix=''){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const path=prefix+entry.name;
  if(entry.isDirectory())await inventory(join(dir,entry.name),path+'/');
  else{const data=await readFile(join(dir,entry.name));assets.push({path,sha256:createHash('sha256').update(data).digest('hex'),bytes:data.length});}
 }
}
await inventory(input);
const release={sourceRepository:'https://github.com/staking-arena-blaze2026/bch-staking-blaze2026',sourceBranch:'blaze2026',sourceCommit:process.env.SOURCE_SHA,websiteRepository:'https://github.com/staking-arena-blaze2026/staking-arena-blaze-site',url:'https://staking-arena-blaze2026.github.io/staking-arena-blaze-site/',builtAt:new Date().toISOString(),network:'mainnet',defaultNetwork:'mainnet',networks:['mainnet','chipnet'],chipnetTransactionsEnabled:false,sourceBaseline:'0f2666c4002098c3534ddec9986b8f9114986119',websiteBaseline:'e685e6bd62381c3a587b3cb1d0c79d2affc0f459',mainnetEnabled:true,walletTransactionVerified:false,assets};
const serialized=JSON.stringify(release,null,2)+'\n';
await writeFile(join(target,'release.json'),serialized);
await writeFile(join(input,'release.json'),serialized);
await writeFile(join(input,'.nojekyll'),'');
console.log('Prepared public website for source',release.sourceCommit,'with',assets.length,'assets');
