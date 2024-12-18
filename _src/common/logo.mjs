let logo_used_style = false;

function fewu_logo() {
    if (logo_used_style) {
        return `<svg fewu-logo xmlns='http://www.w3.org/2000/svg' width=48 height=48><circle n2 cx=21 cy=27 r=18 /><circle cx=21 cy=27 r=12 /><circle n2 cx=33 cy=15 r=12 /><circle cx=33 cy=15 r=8 /></svg><style>svg[fewu-logo]>*{fill:#fff}svg[fewu-logo]>*[n2]{fill:#3272d2}</style>`;
    }
    logo_used_style = true;
    return `<svg fewu-logo xmlns='http://www.w3.org/2000/svg' width=48 height=48><circle n2 cx=21 cy=27 r=18 /><circle cx=21 cy=27 r=12 /><circle n2 cx=33 cy=15 r=12 /><circle cx=33 cy=15 r=8 /></svg>`;
}

const value = fewu_logo;

export {
    value
}