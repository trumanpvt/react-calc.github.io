import {Octokit} from "@octokit/core";
import {apiToken} from "../config";

const octokit = new Octokit({auth: apiToken});

const utf8_to_b64 = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
}

const b64_to_utf8 = (str) => {
    return decodeURIComponent(escape(window.atob(str)));
}

export const fetchProductsFromServer = async () => {

    const {data} = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner: 'trumanpvt',
        repo: 'sber-calc',
        path: 'files/products.json',
        accept: 'application/vnd.github.v3.html+json',
    });

    return {
        sha: data.sha,
        products: JSON.parse(b64_to_utf8(data.content))
    }
}

export const uploadNewProductsExcel = async (file, sha) => {

    return await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: 'trumanpvt',
        repo: 'sber-calc',
        path: 'files/products.json',
        message: 'updated products',
        sha,
        content: utf8_to_b64(JSON.stringify(file)),
    })
}

export const createGuid = () => {
    function _p8(s) {
        const p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }

    return _p8() + _p8(true) + _p8(true) + _p8();
}

export const parseProductTypes = (json) => {

    const typesArray = [];

    json.forEach(item => {

        if (typesArray.indexOf(item.type) === -1) {
            typesArray.push(item.type);
        }
    });

    return typesArray;
}
