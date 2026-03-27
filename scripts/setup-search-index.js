#!/usr/bin/env node
/**
 * setup-search-index.js
 * Run this script to create the Azure AI Search index schema
 * and upload government scheme data.
 *
 * Usage:
 *   node scripts/setup-search-index.js
 */

const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
        const clean = line.trim();
        if (!clean || clean.startsWith('#')) return;
        const eqIdx = clean.indexOf('=');
        if (eqIdx === -1) return;
        const key = clean.slice(0, eqIdx).trim();
        const val = clean.slice(eqIdx + 1).trim();
        if (key && !process.env[key]) process.env[key] = val;
    });
}

const SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT;
const SEARCH_KEY = process.env.AZURE_SEARCH_KEY;
const INDEX_NAME = process.env.AZURE_SEARCH_INDEX || 'schemes-index';
const API_VERSION = '2024-07-01';

if (!SEARCH_ENDPOINT || !SEARCH_KEY) {
    console.error('❌ Missing AZURE_SEARCH_ENDPOINT or AZURE_SEARCH_KEY in .env.local');
    process.exit(1);
}

// ─── Step 1: Create Index Schema ────────────────────────────────────────────

const indexSchema = {
    name: INDEX_NAME,
    fields: [
        { name: 'id', type: 'Edm.String', key: true, searchable: false },
        { name: 'scheme_name', type: 'Edm.String', searchable: true, filterable: true },
        { name: 'ministry', type: 'Edm.String', searchable: true, filterable: true },
        { name: 'description', type: 'Edm.String', searchable: true, filterable: false },
        { name: 'eligibility', type: 'Edm.String', searchable: true, filterable: false },
        { name: 'benefits', type: 'Edm.String', searchable: true, filterable: false },
        { name: 'application_url', type: 'Edm.String', searchable: false, filterable: false },
        { name: 'deadline', type: 'Edm.String', searchable: false, filterable: false },
        { name: 'category', type: 'Edm.String', searchable: true, filterable: true },
        { name: 'match_score', type: 'Edm.Double', searchable: false, filterable: true, sortable: true },
        {
            name: 'states',
            type: 'Collection(Edm.String)',
            searchable: true,
            filterable: true,
        },
    ],
};

// ─── Step 2: Scheme Data ─────────────────────────────────────────────────────

const schemes = [
    {
        id: '1',
        scheme_name: 'PM-KISAN Samman Nidhi',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        description: 'Direct income support of ₹6,000 per year to farmer families across India in three equal installments.',
        eligibility: 'All land-holding farmer families with cultivable land. Excludes income taxpayers, institutional landholders, government employees.',
        benefits: '₹6,000/year in 3 installments of ₹2,000 each via Direct Benefit Transfer',
        category: 'Agriculture',
        application_url: 'https://pmkisan.gov.in',
        deadline: 'Open enrollment',
        states: ['All States'],
        match_score: 0.95,
    },
    {
        id: '2',
        scheme_name: 'Ayushman Bharat PM-JAY',
        ministry: 'Ministry of Health & Family Welfare',
        description: 'World\'s largest health insurance scheme providing ₹5 lakh cover per family per year for secondary and tertiary hospitalisation.',
        eligibility: 'Bottom 40% vulnerable families based on SECC 2011 data. Includes rural deprived and occupationally vulnerable urban workers.',
        benefits: '₹5,00,000 health cover per family per year, cashless treatment at empanelled hospitals',
        category: 'Health',
        application_url: 'https://pmjay.gov.in',
        deadline: 'Open enrollment',
        states: ['All States'],
        match_score: 0.93,
    },
    {
        id: '3',
        scheme_name: 'PM Awas Yojana (Gramin)',
        ministry: 'Ministry of Rural Development',
        description: 'Financial assistance for construction of pucca houses for rural households living in kutcha or dilapidated houses.',
        eligibility: 'Houseless families or those living in zero, one or two room kutcha/dilapidated houses. Priority to SC/ST, minorities, disabled.',
        benefits: '₹1,20,000 in plains; ₹1,30,000 in hilly/NE/difficult areas. Additional support for MGNREGA labour and toilet under SBM.',
        category: 'Housing',
        application_url: 'https://pmayg.nic.in',
        deadline: 'Rolling basis',
        states: ['All States'],
        match_score: 0.90,
    },
    {
        id: '4',
        scheme_name: 'PM Awas Yojana (Urban)',
        ministry: 'Ministry of Housing & Urban Affairs',
        description: 'Credit-linked subsidy and affordable housing for urban poor and middle-income groups in cities.',
        eligibility: 'EWS (income up to ₹3L), LIG (₹3-6L), MIG-I (₹6-12L), MIG-II (₹12-18L) annual household income',
        benefits: 'Subsidy up to ₹2.67 lakh on home loan interest for EWS/LIG; ₹2.35L for MIG-I; ₹2.30L for MIG-II',
        category: 'Housing',
        application_url: 'https://pmaymis.gov.in',
        deadline: 'Rolling basis',
        states: ['All States'],
        match_score: 0.88,
    },
    {
        id: '5',
        scheme_name: 'MGNREGA (Mahatma Gandhi National Rural Employment Guarantee)',
        ministry: 'Ministry of Rural Development',
        description: '100 days guaranteed wage employment per financial year to adult members of rural households willing to do unskilled manual work.',
        eligibility: 'Any adult member of a rural household willing to do unskilled manual work. Requires job card registration.',
        benefits: '100 days employment at ₹267-400/day (state-wise wage rates). Unemployment allowance if work not provided within 15 days.',
        category: 'Employment',
        application_url: 'https://nrega.nic.in',
        deadline: 'Always open',
        states: ['All States'],
        match_score: 0.92,
    },
    {
        id: '6',
        scheme_name: 'PM Mudra Yojana',
        ministry: 'Ministry of Finance',
        description: 'Collateral-free loans to micro and small enterprises for income generating activities in manufacturing, trading and service sectors.',
        eligibility: 'Non-farm micro/small enterprises, small manufacturers, shopkeepers, vendors, artisans, women entrepreneurs',
        benefits: 'Shishu: up to ₹50,000 | Kishore: ₹50,000-5,00,000 | Tarun: ₹5,00,000-10,00,000',
        category: 'Finance',
        application_url: 'https://mudra.org.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.87,
    },
    {
        id: '7',
        scheme_name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
        ministry: 'Ministry of Finance',
        description: 'Universal banking access with zero-balance accounts, RuPay debit card, overdraft facility and insurance coverage.',
        eligibility: 'Any Indian citizen above 10 years of age without a bank account',
        benefits: 'Zero balance account, RuPay card with ₹2L accident insurance, ₹30,000 life cover, ₹10,000 overdraft facility',
        category: 'Finance',
        application_url: 'https://pmjdy.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.85,
    },
    {
        id: '8',
        scheme_name: 'PM Ujjwala Yojana (PMUY)',
        ministry: 'Ministry of Petroleum & Natural Gas',
        description: 'Free LPG connections to women from Below Poverty Line households to replace unclean cooking fuels.',
        eligibility: 'Adult women from BPL families without LPG connection. Priority to SC/ST, PMAY beneficiaries, forest dwellers.',
        benefits: 'Free LPG connection (deposit-free cylinder + pressure regulator + pipe + stove) and first refill free',
        category: 'Women',
        application_url: 'https://pmuy.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.84,
    },
    {
        id: '9',
        scheme_name: 'Beti Bachao Beti Padhao',
        ministry: 'Ministry of Women & Child Development',
        description: 'Multi-sectoral scheme to address declining Child Sex Ratio and promote welfare of girl child through education and empowerment.',
        eligibility: 'Girl children, families with daughters, pregnant women',
        benefits: 'Education support, conditional cash transfers, awareness campaigns, scholarship linkages',
        category: 'Women',
        application_url: 'https://wcd.nic.in/bbbp-schemes',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.80,
    },
    {
        id: '10',
        scheme_name: 'Sukanya Samriddhi Yojana',
        ministry: 'Ministry of Finance',
        description: 'Small savings scheme for girl children with high interest rates and tax benefits to secure their education and marriage expenses.',
        eligibility: 'Girl child below 10 years of age. Maximum 2 accounts per family.',
        benefits: '8.2% interest rate (2024), tax exemption under 80C, maturity after 21 years or marriage after 18 years',
        category: 'Women',
        application_url: 'https://www.nsiindia.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.81,
    },
    {
        id: '11',
        scheme_name: 'PM Scholarship Scheme (PMSS)',
        ministry: 'Ministry of Home Affairs / Ministry of Defence',
        description: 'Scholarships for wards and widows of ex-servicemen/coast guard personnel for professional degree courses.',
        eligibility: 'Wards/widows of ex-servicemen/coast guard. Min 60% in qualifying exam. Age 18-25.',
        benefits: '₹3,000/month for boys, ₹3,500/month for girls for duration of professional course',
        category: 'Education',
        application_url: 'https://ksb.gov.in',
        deadline: 'Annual (July-October)',
        states: ['All States'],
        match_score: 0.78,
    },
    {
        id: '12',
        scheme_name: 'National Scholarship Portal (NSP) Schemes',
        ministry: 'Ministry of Electronics & IT',
        description: 'Unified platform for multiple central and state government scholarship schemes for students from Class 1 to PhD level.',
        eligibility: 'Students from minority, OBC, SC, ST communities and merit-based scholarships. Income criteria apply.',
        benefits: 'Scholarships ranging from ₹1,000 to ₹20,000 per year depending on scheme and level of study',
        category: 'Education',
        application_url: 'https://scholarships.gov.in',
        deadline: 'Annual (October-November)',
        states: ['All States'],
        match_score: 0.82,
    },
    {
        id: '13',
        scheme_name: 'PM Kaushal Vikas Yojana (PMKVY)',
        ministry: 'Ministry of Skill Development & Entrepreneurship',
        description: 'Skill certification and reward scheme to enable youth to take up industry-relevant skill training and secure better livelihoods.',
        eligibility: 'Indian nationals above 14 years, school/college dropouts and unemployed youth',
        benefits: 'Free skill training, certification, ₹8,000 average reward for STT, placement assistance',
        category: 'Employment',
        application_url: 'https://pmkvyofficial.org',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.83,
    },
    {
        id: '14',
        scheme_name: 'Startup India',
        ministry: 'Ministry of Commerce & Industry',
        description: 'Flagship initiative to build a strong startup ecosystem and foster innovation and entrepreneurship across India.',
        eligibility: 'DPIIT-recognised startups incorporated less than 10 years ago with turnover under ₹100 crore',
        benefits: 'Tax exemption for 3 years, self-certification compliance, fast-track patent & IP support, ₹10,000 crore fund of funds',
        category: 'Finance',
        application_url: 'https://startupindia.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.79,
    },
    {
        id: '15',
        scheme_name: 'Atal Pension Yojana (APY)',
        ministry: 'Ministry of Finance',
        description: 'Pension scheme for workers in unorganised sector providing guaranteed monthly pension after age 60.',
        eligibility: 'Indian citizens aged 18-40 years with a savings bank account. Not an income taxpayer.',
        benefits: 'Guaranteed pension of ₹1,000-5,000/month after 60 years depending on contribution amount and age of joining',
        category: 'Finance',
        application_url: 'https://npscra.nsdl.co.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.80,
    },
    {
        id: '16',
        scheme_name: 'PM Fasal Bima Yojana (PMFBY)',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        description: 'Crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events.',
        eligibility: 'All farmers including sharecroppers and tenant farmers growing notified crops',
        benefits: 'Insurance coverage at premium of 2% (Kharif), 1.5% (Rabi), 5% (commercial crops). Full claim for total crop loss.',
        category: 'Agriculture',
        application_url: 'https://pmfby.gov.in',
        deadline: 'Seasonal (submit before season cutoff)',
        states: ['All States'],
        match_score: 0.86,
    },
    {
        id: '17',
        scheme_name: 'e-Shram Portal',
        ministry: 'Ministry of Labour & Employment',
        description: 'National database of unorganised workers providing UAN number and access to social security benefits.',
        eligibility: 'Unorganised workers aged 16-59 not covered under EPFO/ESIC/NPS',
        benefits: 'UAN card, ₹2 lakh accident insurance under PMSBY, priority access to welfare schemes',
        category: 'Employment',
        application_url: 'https://eshram.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.82,
    },
    {
        id: '18',
        scheme_name: 'PM Vishwakarma Yojana',
        ministry: 'Ministry of MSME',
        description: 'Support scheme for traditional artisans and craftspeople from 18 trades to improve quality tools, skills and market access.',
        eligibility: '18 traditional trades: carpenter, blacksmith, goldsmith, potter, tailor, cobbler, mason, barber, washerman etc.',
        benefits: 'Recognition certificate, ₹15,000 toolkit support, skill training ₹500/day stipend, collateral-free loan ₹1-3 lakh at 5%',
        category: 'Employment',
        application_url: 'https://pmvishwakarma.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.81,
    },
    {
        id: '19',
        scheme_name: 'Jal Jeevan Mission',
        ministry: 'Ministry of Jal Shakti',
        description: 'Provide safe and adequate drinking water through individual household tap connections by 2024 to all rural households.',
        eligibility: 'All rural households without tap water connection',
        benefits: 'Free household tap water connection, minimum 55 litres per capita per day supply',
        category: 'Infrastructure',
        application_url: 'https://jaljeevanmission.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.77,
    },
    {
        id: '20',
        scheme_name: 'PM SVANidhi (Street Vendor Loan)',
        ministry: 'Ministry of Housing & Urban Affairs',
        description: 'Micro-credit facility for street vendors to restart livelihoods after COVID-19 lockdowns with formal credit access.',
        eligibility: 'Street vendors operating in urban areas with vending certificate or letter of recommendation',
        benefits: '₹10,000 initial working capital loan → ₹20,000 → ₹50,000 on timely repayment. Digital transaction incentive ₹1,200/year.',
        category: 'Finance',
        application_url: 'https://pmsvanidhi.mohua.gov.in',
        deadline: 'Open',
        states: ['All States'],
        match_score: 0.80,
    },
];

// ─── Helper: REST call ────────────────────────────────────────────────────────

async function azureRequest(method, path, body) {
    const url = `${SEARCH_ENDPOINT}${path}?api-version=${API_VERSION}`;
    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'api-key': SEARCH_KEY,
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    try { return { status: res.status, data: JSON.parse(text) }; }
    catch { return { status: res.status, data: text }; }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    console.log(`\n🔧 Setting up Azure AI Search index: "${INDEX_NAME}"`);
    console.log(`   Endpoint: ${SEARCH_ENDPOINT}\n`);

    // 1. Delete existing index if present
    console.log('1️⃣  Deleting existing index (if any)...');
    const del = await azureRequest('DELETE', `/indexes/${INDEX_NAME}`);
    if (del.status === 204) console.log('   ✅ Old index deleted');
    else if (del.status === 404) console.log('   ℹ️  No existing index found');
    else console.log(`   ⚠️  Delete status: ${del.status}`);

    // 2. Create index
    console.log('\n2️⃣  Creating index schema...');
    const create = await azureRequest('POST', '/indexes', indexSchema);
    if (create.status === 201) {
        console.log('   ✅ Index created successfully');
    } else {
        console.error('   ❌ Failed to create index:', JSON.stringify(create.data, null, 2));
        process.exit(1);
    }

    // 3. Upload documents
    console.log(`\n3️⃣  Uploading ${schemes.length} government schemes...`);
    const upload = await azureRequest('POST', `/indexes/${INDEX_NAME}/docs/index`, {
        value: schemes.map(s => ({ '@search.action': 'upload', ...s })),
    });

    if (upload.status === 200 || upload.status === 201) {
        const results = upload.data?.value || [];
        const succeeded = results.filter(r => r.status === true).length;
        const failed = results.filter(r => r.status === false).length;
        console.log(`   ✅ Uploaded: ${succeeded} schemes`);
        if (failed > 0) console.log(`   ⚠️  Failed: ${failed} schemes`);
    } else {
        console.error('   ❌ Upload failed:', JSON.stringify(upload.data, null, 2));
        process.exit(1);
    }

    console.log('\n🎉 Done! Your Azure AI Search index is ready with government scheme data.');
    console.log('   Restart your dev server and try asking about schemes in the chat!\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
