import page from 'https://unpkg.com/page/page.mjs';
import {html, render} from 'https://unpkg.com/lit-html?module';
import {until} from 'https://unpkg.com/lit-html/directives/until?module';
import {cache} from 'https://unpkg.com/lit-html/directives/cache?module';
import {classMap} from 'https://unpkg.com/lit-html/directives/class-map?module';
import {styleMap} from 'https://unpkg.com/lit-html/directives/style-map?module';


const topics = {
    it: 'IT',
    languages: 'Languages',
    hardware: 'Hardware',
    software: 'Software',
    frameworks: 'Frameworks',
    cooking: 'Cooking',
    math: "Math"
}

export {
    page,
    html,
    render,
    until,
    topics,
    cache,
    classMap,
    styleMap
}

