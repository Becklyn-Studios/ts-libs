export type StructuredDataIndex =
    | StructuredDataWebsite
    | StructuredDataRating
    | StructuredDataPerson
    | StructuredDataReview
    | StructuredDataAggretateRating
    | StructuredDataAggregateOffer
    | StructuredDataGeoCoordinates
    | StructuredDataPostalAddress
    | StructuredDataPlace
    | StructuredDataOrganization
    | StructuredDataListItem
    | StructuredDataBreadcrumbList
    | StructuredDataNewsArticle
    | StructuredDataAnswer
    | StructuredDataQuestion
    | StructuredDataFAQPage;

export interface StructuredDataWebsite {
    "@type": "WebSite";
    name: string;
    url: string;
}

export interface StructuredDataRating {
    "@type": "Rating";
    ratingValue: number;
    bestRating: number;
}

export interface StructuredDataPerson {
    "@type": "Person";
    name: string;
}

export interface StructuredDataReview {
    "@type": "Review";
    reviewRating: StructuredDataRating;
    author: StructuredDataPerson;
}

export interface StructuredDataAggretateRating {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
}

export interface StructuredDataAggregateOffer {
    "@type": "AggregateOffer";
    offerCount: number;
    lowPrice: number;
    highPrice: number;
    priceCurrency: string;
}

export interface StructuredDataGeoCoordinates {
    "@type": "GeoCoordinates";
    latitude?: number;
    longitude?: number;
}

export interface StructuredDataPostalAddress {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality?: string;
    postalCode?: string;
    streetAddress?: string;
}

export interface StructuredDataPlace {
    "@type": "Place";
    geo: StructuredDataGeoCoordinates;
    address: StructuredDataPostalAddress;
}

export interface StructuredDataContactPoint {
    "@type": "ContactPoint";
    name?: string;
    productSupported?: string;
    email?: string;
    telephone?: string;
    image?: string;
}

export interface StructuredDataMonetaryAmount {
    "@type": "MonetaryAmount";
    currency?: string;
    minValue?: number;
    maxValue?: number;
}

export interface StructuredDataOrganization {
    "@type": "Organization";
    name: string;
    url: string;
    image?: string;
    logo: string;
    sameAs?: readonly string[];
}

export interface StructuredDataListItem {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
}

export interface StructuredDataBreadcrumbList {
    "@type": "BreadcrumbList";
    numberOfItems: number;
    itemListElement: StructuredDataListItem[];
}

export interface StructuredDataNewsArticle {
    "@type": "NewsArticle";
    url: string;
    publisher: StructuredDataOrganization;
    mainEntityOfPage: string;
    headline?: string;
    image?: string;
    articleBody?: string;
    datePublished?: string;
}

export interface StructuredDataAnswer {
    "@type": "Answer";
    text: string;
}

export interface StructuredDataQuestion {
    "@type": "Question";
    name?: string;
    acceptedAnswer: StructuredDataAnswer;
}

export interface StructuredDataFAQPage {
    "@type": "FAQPage";
    mainEntity: (StructuredDataQuestion | undefined)[];
}
