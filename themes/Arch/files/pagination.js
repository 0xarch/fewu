function renderPaginationJSON(Pagination) {
    let config = JSON.parse(Pagination.innerHTML);
    Pagination.innerHTML = "";
    let page = parseInt(config.page), now = parseInt(config.now);
    if(page<1) return;
    let haveSeparator = page > 5;
    let builds = [];

    let GoPrev = document.createElement('a'), GoNext = document.createElement('a');
    GoPrev.textContent = "<";
    GoNext.textContent = ">";
    GoPrev.classList.add("prev");
    GoNext.classList.add("next");
    if (now == 1) GoPrev.classList.add("disabled");
    else {
        let i = now - 1;
        GoPrev.setAttribute("href", eval('`' + config.link + '`'));
    }
    if (now == page) GoNext.classList.add("disabled");
    else {
        let i = now + 1;
        GoNext.setAttribute("href", eval('`' + config.link + '`'));
    }
    Pagination.appendChild(GoPrev);

    for (let i = 1; i <= page; i++) {
        if ([1, now - 1, now, now + 1, page].includes(i)) {
            builds.push(i);
        } else if (haveSeparator) {
            if (builds.at(-1) != "space")
                builds.push("space");
        }
    }
    for (let item of builds) {
        if (item == "space") {
            Pagination.appendChild(document.createElement("space"));
            continue;
        }
        let i = item;
        let Page = document.createElement("a");
        Page.textContent = i;
        Page.classList.add("page");
        if (i == now) {
            Page.classList.add("this");
        }
        Page.setAttribute("href", eval('`' + config.link + '`'));
        Pagination.appendChild(Page);

    }
    Pagination.appendChild(GoNext);
}