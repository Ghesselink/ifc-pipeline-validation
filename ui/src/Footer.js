import {PageContext} from './Page';
import { useContext } from 'react';


function Footer(){
    const context = useContext(PageContext);

    const style = {padding:'4px', textAlign:'center'};
    return (
        <div style={style}>
            <span>{context["environment"]} - Version 0.5.5 | Copyright © 2023 buildingSMART All Rights Reserved | <a href="https://www.buildingsmart.org/wp-content/uploads/2018/05/PrivacyandCookiePolicyV2.pdf" target="_blank" rel="noopener">Privacy and Cookie Statement</a>&nbsp;| <a href="https://www.buildingsmart.org/wp-content/uploads/2021/09/20210923_TermsOfService.pdf" target="_blank" rel="noopener">Terms and Conditions</a>&nbsp;|</span>
            {context["pageTitle"] == "report" &&<div> This validation report is generated by bSI Validation Service based on the input IFC model | bSI assumes no responsability or liability for the content of this report</div>}
        </div>
    )
}

export default Footer;