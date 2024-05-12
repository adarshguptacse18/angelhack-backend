// node --version # Should be >= 18
// npm install @google/generative-ai

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_API_KEY;

async function getExplanation(companyData) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 8192,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];
    console.log({companyData});
    const positive = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "Can  you try to explain how to improve financial score for this data?\\nYou are given dataset of a company.  Where the model predicted the financial_health_score as 70 (which ranges from 0 to 100). Main key areas are age (in months), credit_score (which ranges from 0 to 900), loan_amount, loan_tenure, late_payments, month_wise_deposts, month_wise_withdrawal. Can you give the response a with a list of three strings format where only positive factors are written in bullet points? Note: the output should be list of three sentences{point1: lorem, point2: ipsum, point3: hola}. That's all nothing else. Give output in JSON format. Don't write anything else Output Format list of three strings. company_data: " + JSON.stringify(companyData) + "\\n" }],
            },
        ],
    });

    const negative = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "Can  you try to explain how to improve financial score for this data?\\nYou are given dataset of a company.  Where the model predicted the financial_health_score as 70 (which ranges from 0 to 100). Main key areas are age (in months), credit_score (which ranges from 0 to 900), loan_amount, loan_tenure, late_payments, month_wise_deposts, month_wise_withdrawal. Can you give the response a with a list of three strings format where only negative factors are written in bullet points? Note: the output should be list of three sentences{point1: lorem, point2: ipsum, point3: hola}. That's all nothing else. Give output in JSON format. Don't write anything else Output Format list of three strings. company_data: " + JSON.stringify(companyData) + "\\n" }],
            },
        ],
    });
    const positiveResult = await positive.sendMessage("YOUR_USER_INPUT");
    const negativeResult = await negative.sendMessage("YOUR_USER_INPUT");

    return {
        p: (positiveResult.response.text().replace("json", "")),
        n: (negativeResult.response.text().replace("json", "")),
    }
}


module.exports = getExplanation;