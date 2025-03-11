import styled from "styled-components";

export const DefaultBuilderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1rem;

    ${p => p.theme.breakpoints.min("l")} {
        gap: 2rem;
    }
`;

export const DefaultSectionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    &:last-child {
        margin-bottom: 0;
    }

    ${p => p.theme.breakpoints.min("m")} {
        margin-bottom: 3rem;
    }

    ${p => p.theme.breakpoints.min("l")} {
        gap: 2rem;
    }
`;

export const DefaultRowWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;

    ${p => p.theme.breakpoints.min("m")} {
        flex-direction: row;
    }

    ${p => p.theme.breakpoints.min("l")} {
        gap: 2rem;
    }
`;

export const DefaultFieldWrapper = styled.div<{ columns?: number }>`
    ${p => p.theme.breakpoints.max("m")} {
        width: 100%;
    }

    ${p => p.theme.breakpoints.min("m")} {
        flex: 1 1 0;
        max-width: ${p => p.columns && `calc(${100 * (p.columns / 12)}% - 1rem)`};
    }
`;
