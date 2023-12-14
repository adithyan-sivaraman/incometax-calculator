export function incomeTaxNew(years, income,agriIncome) {
    
    const netSalary = income.salary || 0
    const netHouse = income.house || 0
    const netBusiness = income.business || 0
    const totalCapgain = income.capgain || 0
    const capGain = totalCapgain.total_gain || 0
    const otherIncome =parseFloat( income.others) || 0
    const totalIncome = parseFloat(netSalary) + parseFloat(netHouse) + parseFloat(netBusiness) + parseInt(capGain) + parseFloat(otherIncome);
    
    let taxableIncome =Math.max(parseFloat(totalIncome), 0)
    
    const normalStcg = parseFloat(totalCapgain.stcg_shares_others||0) + parseFloat(totalCapgain.stcg_other_assets||0) || 0
    
    let basicLimit = 300000;
    let grossTaxLiab = 0;
    let eduCess = 0;
    let totalTax = 0;
    let rebate = 0;

    const netTaxIncome = Math.round((taxableIncome - parseFloat(capGain) + normalStcg) / 10) * 10;
    
    let agriTax = 0;
    let netTaxAgriIncome = basicLimit + parseFloat(agriIncome);

    if (netTaxAgriIncome <= basicLimit || parseFloat(agriIncome) <= 5000) {
        agriTax = 0;
    }
    else if (netTaxAgriIncome < 600000) {
        agriTax = Math.ceil((netTaxAgriIncome - basicLimit) * 0.05);
    }
    else if (netTaxAgriIncome < 900000) {
        
        agriTax = Math.ceil((netTaxAgriIncome - 600000) * 0.10) + 15000;
    }
    else if (netTaxAgriIncome < 1200000) {
        
        agriTax = Math.ceil((netTaxAgriIncome - 900000) * 0.15) + 45000;
    }
    else if (netTaxAgriIncome < 1500000) {
        
        agriTax = Math.ceil((netTaxAgriIncome - 1200000) * 0.20) + 90000;
    }
    else {
        agriTax = Math.ceil((netTaxAgriIncome - 1500000) * 0.30) + 150000;
    }
    
    const adjustment = Math.max(basicLimit - netTaxIncome, 0)

    const { ltcg_shares_listed, ltcg_shares_others, ltcg_other_assets, stcg_shares_listed ,total_gain} = totalCapgain;
    const sec112A = parseFloat(ltcg_shares_listed) > 100000 ? parseFloat(ltcg_shares_listed-100000) * 0.10 : 0;
    const sec111A = parseFloat(stcg_shares_listed) * 0.15;
    const sec112 = (parseFloat(ltcg_shares_others) + parseFloat(ltcg_other_assets) - adjustment) * 0.20;
    const capGainTax =total_gain? sec112A + sec111A + sec112:0;
    
    if (netTaxIncome < basicLimit) {
        grossTaxLiab = 0;
    }
    else if (netTaxIncome < 600000) {
        grossTaxLiab = Math.ceil((netTaxIncome - basicLimit) * 0.05) - agriTax;

    }

    else if (netTaxIncome < 900000) {
        grossTaxLiab = Math.floor((netTaxIncome - 600000) * 0.10) + 15000 - Math.floor(parseFloat(agriTax));

    }
    else if (netTaxIncome < 1200000) {
        grossTaxLiab = Math.floor((netTaxIncome - 900000) * 0.15) + 45000 - Math.floor(parseFloat(agriTax));

    }
    else if (netTaxIncome < 1500000) {
        grossTaxLiab = Math.floor((netTaxIncome - 1200000) * 0.20) + 90000 - Math.floor(parseFloat(agriTax));
    }
    else {
        grossTaxLiab = Math.floor((netTaxIncome - 1500000) * 0.30) + 150000 - Math.floor(parseFloat(agriTax));
    }



    if (netTaxIncome - parseFloat(agriIncome) < 500000) {
        rebate = Math.min(grossTaxLiab + agriTax, 12500);
    }
    
    let surcharge = surchargeCalculation(netTaxIncome,agriIncome,capGain,normalStcg,grossTaxLiab,capGainTax);
    let grossAfterRebate = grossTaxLiab + surcharge - rebate + capGainTax;
    
    eduCess = Math.ceil(grossAfterRebate * 0.04)
    totalTax = grossAfterRebate + eduCess
    
    
    return { gross: grossTaxLiab-rebate+capGainTax, cess: eduCess, total: totalTax, surcharge: surcharge }
    
}

const surchargeCalculation = (netTaxIncome,agriIncome,capGain,normalStcg,grossTaxLiab,capGainTax)=>{
    
    let surcharge = 0;
    let relief = 0;
    let taxIncome = netTaxIncome+parseFloat(capGain) - parseFloat(normalStcg);
    let capitalGains = +parseFloat(capGain) - parseFloat(normalStcg)
    
    if (taxIncome > 5000000 && taxIncome < 10000000) {

        surcharge = Math.floor((grossTaxLiab+capGainTax) * .10);
        relief = Math.floor((grossTaxLiab+capGainTax) * 1.10) - ((3500000-capitalGains)*0.30+capGainTax+ 150000 + (taxIncome - parseFloat(agriIncome) - 5000000))
    }
    else if (taxIncome < 20000000) {

        surcharge = Math.floor((grossTaxLiab+capGainTax) * .15);
        relief = Math.floor((grossTaxLiab+capGainTax) * 1.15) - 
        (((8500000-capitalGains)*0.30+capGainTax+ 150000) * 1.10 + (taxIncome - parseFloat(agriIncome) - 10000000))
    }
    else if (taxIncome >20000000 && netTaxIncome <20000000) {
        
        surcharge = Math.floor(grossTaxLiab+capGainTax) * .15;
        relief = Math.floor((grossTaxLiab+capGainTax) * 1.15) - 
        (((18500000-capitalGains)*0.30+capGainTax+ 150000) * 1.15 + (taxIncome - parseFloat(agriIncome) - 20000000))
        
    }
    else if(netTaxIncome>20000000){
        
        surcharge = Math.floor(grossTaxLiab*.25+capGainTax * .15);
        relief = Math.floor(grossTaxLiab*.25+capGainTax * .15) - 
        (((18500000-capitalGains)*0.30+capGainTax+ 150000) * 1.15 + (taxIncome - parseFloat(agriIncome) - 20000000))
    }
    

    let surchargeAfterRelief = surcharge - Math.max(relief,0)

    return Math.max(surchargeAfterRelief,0);
}


