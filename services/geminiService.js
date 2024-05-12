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
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        history: [
            {
                role: "user",
                parts: [{ text: "Can  you try to explain how to improve financial score for this data?\\nYou are given dataset of a company.  Where the model predicted the financial_health_score as 70 (which ranges from 0 to 100). Main key areas are age (in months), credit_score (which ranges from 0 to 900), loan_amount, loan_tenure, late_payments, month_wise_deposts, month_wise_withdrawal. Can you give the response a with a list of three strings format where only positive factors are written in bullet points? Note: the output should be list of three sentences. That's all nothing else. Output Format list of three strings. \n\n```\n{\"id\":13,\"name\":\"Major Company\",\"type\":null,\"age\":null,\"size\":null,\"user_id\":\"123\",\"pan\":\"DILSN8886O\",\"annual_revenue\":\"9417474\",\"annual_profit\":null,\"credit_score\":712,\"loan_amount\":1000000,\"loan_tenure\":10,\"late_payments\":7,\"financial_health_score\":77,\"month_wise_deposits\":{\"2017-5\":77053,\"2017-6\":0,\"2017-7\":1263503,\"2017-8\":935440,\"2017-9\":966065,\"2017-10\":822832,\"2017-11\":1123122,\"2018-0\":1141465,\"2018-1\":1084954,\"2018-2\":1139232,\"2018-3\":863808},\"month_wise_withdrawal\":{\"2017-5\":0,\"2017-6\":909,\"2017-7\":615327,\"2017-8\":1728029,\"2017-9\":680824,\"2017-10\":715428,\"2017-11\":686892,\"2018-0\":642697,\"2018-1\":1156376,\"2018-2\":1301874,\"2018-3\":650801}}\n```" }],
            },
        ],
    });

    const result = await chat.sendMessage("YOUR_USER_INPUT");
    const response = result.response;
    return response.text();
}


module.exports = getExplanation;