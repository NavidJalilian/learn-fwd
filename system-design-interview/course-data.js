Course.register({
 slug:'system-design-interview', book:'System Design Interview – An Insider’s Guide', author:'Alex Xu', prefix:'sdi',
 tag:'Kitebird course', castIcon:'layers', castNote:'You are a backend engineer at <b>Kitebird</b>, a made-up app for hobby makers, designing its systems one design review at a time.',
 lessons:[
 {id:'0001',ch:'7',file:'0001-unique-id-generator.html',title:'Design a unique ID generator',part:'Back-end building blocks'},
 {id:'0002',ch:'8',file:'0002-url-shortener.html',title:'Design a URL shortener',part:'Back-end building blocks'},
 {id:'0003',ch:'9',file:'0003-web-crawler.html',title:'Design a web crawler',part:'Back-end building blocks'},
 {id:'0004',ch:'10',file:'0004-notification-system.html',title:'Design a notification system',part:'Back-end building blocks'},
 {id:'0005',ch:'11',file:'0005-news-feed.html',title:'Design a news feed',part:'Social and real-time products'},
 {id:'0006',ch:'12',file:'0006-chat-system.html',title:'Design a chat system',part:'Social and real-time products'},
 {id:'0007',ch:'13',file:'0007-search-autocomplete.html',title:'Design search autocomplete',part:'Social and real-time products'},
 {id:'0008',ch:'14',file:'0008-design-youtube.html',title:'Design YouTube',part:'Media and storage'},
 {id:'0009',ch:'15',file:'0009-google-drive.html',title:'Design Google Drive',part:'Media and storage'}
 ],
 glossary:{
 'four-step':'Four-step framework: the book’s recipe for every design interview: 1) understand the problem and set the scope, 2) propose a high-level design and get buy-in, 3) dive deep into a few parts, 4) wrap up.',
 qps:'QPS (queries per second): how many requests a system must handle each second. Peak QPS is the busiest moment, often guessed as twice the average.',
 dau:'DAU (daily active users): how many different people use the product on a typical day.',
 estimate:'Back-of-the-envelope estimate: a quick rough sum, done out loud, to size a system (requests per second, storage, cost) before designing it.',
 'load-balancer':'Load balancer: a traffic director that spreads incoming requests across several servers, and stops sending to a server that is down.',
 stateless:'Stateless server: a server that keeps no user data between requests, so any copy of it can answer any request and you can add or remove copies freely.',
 spof:'Single point of failure: one part that, if it breaks, takes the whole system down with it.',
 cache:'Cache: a small, fast store (usually in memory) that keeps copies of often-read data so you don’t fetch it from the slower database every time.',
 cdn:'CDN (content delivery network): servers spread around the world that keep copies of large files like images and videos close to users, so they load fast.',
 'message-queue':'Message queue: a waiting line between two parts of a system. One part drops jobs in, another picks them up when ready, so neither waits for the other and bursts are absorbed.',
 sharding:'Sharding: splitting one big set of data across several databases (shards), each holding one slice, e.g. users A–M on one and N–Z on another.',
 replication:'Replication: keeping copies of the same data on several machines, so the system survives one machine failing and can spread out reads.',
 'consistent-hashing':'Consistent hashing: a way of spreading data or work across servers so that adding or removing a server moves only a small share of it.',
 eventual:'Eventual consistency: copies of the data may briefly disagree after a change, but they all catch up soon. Strong consistency means every reader sees the latest value at once.'
 }
});
