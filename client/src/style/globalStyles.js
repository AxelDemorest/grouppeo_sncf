import { createGlobalStyle } from 'styled-components';
 
export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        font-family: 'Avenir', sans-serif !important;
        box-sizing: content-box;
    }

    code {
        font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
    }
`;