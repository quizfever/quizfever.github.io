import page from 'https://unpkg.com/page@1.11.6/page.mjs';
import {html, render} from 'https://unpkg.com/lit-html@2.2.3?module';
import {until} from 'https://unpkg.com/lit-html@2.2.3/directives/until?module';
import {cache} from 'https://unpkg.com/lit-html@2.2.3/directives/cache?module';
import {classMap} from 'https://unpkg.com/lit-html@2.2.3/directives/class-map?module';
import {styleMap} from 'https://unpkg.com/lit-html@2.2.3/directives/style-map?module';


const topics = {
    languages: 'Foreign Languages',
    hardware: 'Hardware',
    software: 'Software',
    frameworks: 'Frameworks',
    cooking: 'Cooking',
    math: "Math",
    leisure: "Leisure time",
    sport: "Sport",
    other: "Other"
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

