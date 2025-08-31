import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { APICallError } from 'ai';
import { EmptyResponseBodyError } from 'ai';
import { JSONParseError } from 'ai';
import { InvalidPromptError } from 'ai';
import { LoadAPIKeyError } from 'ai';
import { MessageConversionError } from 'ai';
import { toast } from 'sonner';




export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const result = streamText({
            model: openai('gpt-3.5-turbo'),
            prompt,

        });
        return result.toUIMessageStreamResponse();

    } catch (error: any) {
        if (error instanceof APICallError) {
            console.error("The API call fails", error);
        }
        if (error instanceof EmptyResponseBodyError) {
            console.error("The server returns an empty response body", error);
        }
        if (error instanceof InvalidPromptError) {
            console.error("the prompt provided is invalid.", error);
        }
        if (error instanceof JSONParseError) {
            console.error(" JSON fails to parse.", error);
        }
        if (error instanceof LoadAPIKeyError) {
            console.error(" API key is not loaded successfully.", error);
        }
        if (error instanceof MessageConversionError) {
            console.error("Message conversion fails.", error);
        }
        console.error("An unexpected error occur")
        throw error
    }
}