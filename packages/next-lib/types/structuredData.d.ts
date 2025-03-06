export namespace StructuredData {
    type Index =
        | StructuredData.Website
        | StructuredData.Rating
        | StructuredData.Person
        | StructuredData.Review
        | StructuredData.AggretateRating
        | StructuredData.AggregateOffer
        | StructuredData.GeoCoordinates
        | StructuredData.PostalAddress
        | StructuredData.Place
        | StructuredData.Organization
        | StructuredData.ListItem
        | StructuredData.BreadcrumbList
        | StructuredData.NewsArticle
        | StructuredData.Answer
        | StructuredData.Question
        | StructuredData.FAQPage;

    interface Website {
        "@type": "WebSite";
        name: string;
        url: string;
    }

    interface Rating {
        "@type": "Rating";
        ratingValue: number;
        bestRating: number;
    }

    interface Person {
        "@type": "Person";
        name: string;
    }

    interface Review {
        "@type": "Review";
        reviewRating: Rating;
        author: Person;
    }

    interface AggretateRating {
        "@type": "AggregateRating";
        ratingValue: number;
        reviewCount: number;
    }

    interface AggregateOffer {
        "@type": "AggregateOffer";
        offerCount: number;
        lowPrice: number;
        highPrice: number;
        priceCurrency: string;
    }

    interface GeoCoordinates {
        "@type": "GeoCoordinates";
        latitude?: number;
        longitude?: number;
    }

    interface PostalAddress {
        "@type": "PostalAddress";
        addressCountry: string;
        addressLocality?: string;
        postalCode?: string;
        streetAddress?: string;
    }

    interface Place {
        "@type": "Place";
        geo: GeoCoordinates;
        address: PostalAddress;
    }

    interface ContactPoint {
        "@type": "ContactPoint";
        name?: string;
        productSupported?: string;
        email?: string;
        telephone?: string;
        image?: string;
    }

    interface MonetaryAmount {
        "@type": "MonetaryAmount";
        currency?: string;
        minValue?: number;
        maxValue?: number;
    }

    interface Organization {
        "@type": "Organization";
        name: string;
        url: string;
        image?: string;
        logo: string;
        sameAs?: readonly string[];
    }

    interface ListItem {
        "@type": "ListItem";
        position: number;
        name: string;
        item: string;
    }

    interface BreadcrumbList {
        "@type": "BreadcrumbList";
        numberOfItems: number;
        itemListElement: ListItem[];
    }

    interface NewsArticle {
        "@type": "NewsArticle";
        url: string;
        publisher: Organization;
        mainEntityOfPage: string;
        headline?: string;
        image?: string;
        articleBody?: string;
        datePublished?: string;
    }

    interface Answer {
        "@type": "Answer";
        text: string;
    }

    interface Question {
        "@type": "Question";
        name?: string;
        acceptedAnswer: Answer;
    }

    interface FAQPage {
        "@type": "FAQPage";
        mainEntity: (Question | undefined)[];
    }
}
