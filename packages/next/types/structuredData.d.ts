export type Index =
    | Website
    | Rating
    | Person
    | Review
    | AggretateRating
    | AggregateOffer
    | GeoCoordinates
    | PostalAddress
    | Place
    | Organization
    | ListItem
    | BreadcrumbList
    | NewsArticle
    | Answer
    | Question
    | FAQPage;

export interface Website {
    "@type": "WebSite";
    name: string;
    url: string;
}

export interface Rating {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
}

export interface Person {
    "@type": "Person";
    name: string;
}

export interface Review {
    "@type": "Review";
    reviewRating: Rating;
    author: Person;
}

export interface AggretateRating {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
}

export interface AggregateOffer {
    "@type": "AggregateOffer";
    offerCount: number;
    lowPrice: number;
    highPrice: number;
    priceCurrency: string;
}

export interface GeoCoordinates {
    "@type": "GeoCoordinates";
    latitude?: number;
    longitude?: number;
}

export interface PostalAddress {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality?: string;
    postalCode?: string;
    streetAddress?: string;
}

export interface Place {
    "@type": "Place";
    geo: GeoCoordinates;
    address: PostalAddress;
}

export interface ContactPoint {
    "@type": "ContactPoint";
    name?: string;
    productSupported?: string;
    email?: string;
    telephone?: string;
    image?: string;
}

export interface MonetaryAmount {
    "@type": "MonetaryAmount";
    currency?: string;
    minValue?: number;
    maxValue?: number;
}

export interface Organization {
    "@type": "Organization";
    name: string;
    url: string;
    image?: string;
    logo: string;
    sameAs?: readonly string[];
}

export interface ListItem {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
}

export interface BreadcrumbList {
    "@type": "BreadcrumbList";
    numberOfItems: number;
    itemListElement: ListItem[];
}

export interface NewsArticle {
    "@type": "NewsArticle";
    url: string;
    publisher: Organization;
    mainEntityOfPage: string;
    headline?: string;
    image?: string;
    articleBody?: string;
    datePublished?: string;
}

export interface Answer {
    "@type": "Answer";
    text: string;
}

export interface Question {
    "@type": "Question";
    name?: string;
    acceptedAnswer: Answer;
}

export interface FAQPage {
    "@type": "FAQPage";
    mainEntity: (Question | undefined)[];
}
