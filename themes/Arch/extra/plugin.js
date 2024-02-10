function plugin(){
    let _prev_bid = undefined;
    Posts.forEach(item => {
        item['strLength']=item['textContent'].length;
        if(_prev_bid){
            item['prevBID'] = _prev_bid;
            Sorts.BID[_prev_bid]['nextBID'] = item.bid;
        }
        _prev_bid = item.bid;
    });
    return {
        postCount: Posts.length
    }
}