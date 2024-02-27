<template>
    <div class="blog-container">
      <main class="blog-main">
        <article>
          <h1>Microsoft vs Google - ChatGPT taking over search?</h1>
          <hr>
          <section>
            <p>If you haven't been living under a rock for the past few weeks, you've probably heard about the ChatGPT hype and how it's changed how people think of large language models (LLMs). You might not be aware that Microsoft and OpenAI, the firm behind ChatGPT, have been working closely together since 2019 [1]; there are speculations that Microsoft intends to increase its investment by $10 billion [2]. With regard to search, Microsoft has lagged behind Google for the last decade, but this partnership may enable them to overtake Google and take the lead. In this blog, we'll talk about what ChatGPT and upcoming LLMs might entail for the search industry, as well as how Microsoft might profit from them.</p>

<h2>Can ChatGPT take over traditional search engines?</h2>
<p>A study from Surge AI [3] compared Google and ChatGPT results for 500 search queries and dubbed ChatGPT an "existential threat" to Google. Users have claimed to regularly use ChatGPT as a partial replacement for search. When users were asked which one was better, ChatGPT scored better than conventional Google search:</p>
<img src="/src/assets/img/writing/google_vs_microsoft/1.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">

<p>But not everyone was happy when it comes to ChatGPT, when we look at the detailed reviews for each candidate, we see that while ChatGPT does have a higher average score, it has a higher variance, with more highs and lows.</p>

<img src="/src/assets/img/writing/google_vs_microsoft/2.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">
<p>Users seem to either love or hate ChatGPT, while Google had a consistently high score, failing to reach the "Amazing" score ChatGPT achieved. Let’s analyze what makes ChatWhile Google continually received good ratings, it fell short of ChatGPT's "Amazing" grade. Users appear to either adore or hate ChatGPT. Let's examine what makes ChatGPT “horrible” or“amazing”.</p>

<h3>The horrible</h3>
 <p>- Wrong Answers: misleading impression of greatness and overconfidence: Sam Altman (OpenAI’s CEO) warned about its use for important topics [4].  ChatGPT can not be trusted to provide rightful information.</p>
<img src="/src/assets/img/writing/google_vs_microsoft/3.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">

<p>- Lack of internet access: ChatGPT is unaware of recent events because it is based on the GPT3 model, which was trained sometime in 2021. Yes, it can answer complex questions, but you can't use it to see how my most recent football game ended 😞. Unlike Google, which is brilliant at surfacing live information about any sports query.</p>
<img src="/src/assets/img/writing/google_vs_microsoft/4.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">

<p>- Bias Issues: ChatGPT results might be biased or unfair. In fact, ChatGPT has displayed discrimination toward members of minority groups. This is likely a symptom of bias in the training data.</p>
<img src="/src/assets/img/writing/google_vs_microsoft/5.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">
<p>Example of ChatGPT bias from @XX [5]</p>

<h3>The amazing</h3>
<p>- Answering questions: ChatGPT is great at answering questions, you could ask about wildly different topics and get a concise answer which will be right most of the time. From asking mathematical problems, writing code, or synthesizing concepts.</p>
<img src="/src/assets/img/writing/google_vs_microsoft/6.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">
<p>- Copywriting: From writing to restyling people are using ChatGPT to help them write articles, greatly empowering writers to create content. Even I used it to correct my grammar in this blog post!</p>
<img src="/src/assets/img/writing/google_vs_microsoft/7.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">
<p>- Passing academic tests: ChatGPT was recently banned by the New York City Department of Education ********[11] as students would often fill their writing homework with it. We have seen it take IQ tests with results from 83 [6] to 147 [7] — even passing a practice bar exam!</p>
<img src="/src/assets/img/writing/google_vs_microsoft/8.png" alt="ChatGPT vs Google" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;">
<p>For me, ChatGPT has replaced some of the searches I used to make on Google and has evolved into a tool in my daily routine. When the solution to a coding query is probably buried beneath disorganized library documentation, ChatGPT can easily find the answer.</p>

<p>We have seen promising startups defy google search with even less powerful AI models. You.com offers a redesigned AI-powered search engine that promises greater personalization. You started providing a ChatGPT-style chatbot on its website that can respond to inquiries and carry on a discussion, expanding the use of artificial intelligence in online technologies. Additionally, it offers conventional search, and lately, stable diffusion capabilities for generative AI tools were added.</p>

<h2>How can LLMs give Microsoft the edge over Google?</h2>
<p>With Microsoft's stake in OpenAI, they will have preference usage of this technology to integrate it into their services. If they can integrate the fantastic aspects of LLMs into Bing, I anticipate that many users will move to Bing even if they had never given it any thought before (myself included).</p>

<p>Apart from search, there are other areas that could be powered by these models, Microsoft is looking into bringing these models into their already dominant productivity tools [8]. Imagine writing emails via prompts or even having a suggested reply to an email based on the email thread!</p>

<p>Google, however, is still in the running. Google prefers to be transparent about most of its work, but it keeps the work on its "golden egg" (search) relatively confidential. Reports from an employee in hacker news show that they are actively working on this [10]:</p>

<q>
    I work at Alphabet and I recently went to an internal tech talk about deploying large language models like this at Google. As a disclaimer I'll first note that this is not my area of expertise, I just attended the tech talk because it sounded interesting.Large language models like GPT are one of the biggest areas of active ML research at Google, and there are a ton of pretty obvious applications for how they can be used to answer queries, index information, etc. There is a huge budget at Google related to staffing people to work on these kinds of models and do the actual training, which is very expensive because it takes a ton of computing capacity to train these super huge language models. However what I gathered from the talk is the economics of actually using these kinds of language models in the biggest Google products (e.g. search, gmail) isn't quite there yet. It's one thing to put up a demo that interested nerds can play with, but it's quite another thing to try to integrate it deeply into a system that serves billions of requests a day when you take into account serving costs, added latency, and the fact that the average revenue on something like a Google search is close to infinitesimal already. I think I remember the presenter saying something like they'd want to reduce the costs by at least 10x before it would be feasible to integrate models like this in products like search. A 10x or even 100x improvement is obviously an attainable target in the next few years, so I think technology like this is coming in the next few years.
    Despite the scale expense cited, I think Google has been experimenting with these tools even before OpenAI but has been hesitant to use them. They had no actual competitors, therefore they had little incentive to innovate because of their dominant position, which puts them in a much worse situation when the bad sides of LLMs emerge. The environment has been shaken, however, by the appearance of an UnderDog and the incredible aspects of this technology.
</q>

<h2>Predictions for the future of LLM and Search</h2>
<p>LLMs cannot take the role of conventional search engines, but they will undoubtedly be a part of it in the future. The absence of sources, accuracy, and objectivity are categorically necessary qualities for a search engine.</p>

<p>The future belongs to search engines and LLMs working together. Finding the appropriate integration to make use of their amazing sides would be the key to dominating the search sector, as evidenced by users switching some of their queries to ChatGPT, which shows that LLMs can outperform them in specific scenarios.</p>

<p>This war will be won by Google. I don't like to bet against underdogs, but I think Google will produce its own version shortly (and a more powerful one). The searches can be made richer by combining their current search with an "AI Google" search. Greater models than GPT3 have already been trained by them [9] and there are rumors about Deepmind (an AI company acquired by google) working on a response [12] and it's a matter of time before they show something.</p>


<!-- FILEPATH: /Users/jiwidi/projects/github/jiwidi.github.io/src/views/writing/search_google_vs_microsoft.vue -->

<ul>
    <li><a href="https://openai.com/blog/microsoft/">[1] https://openai.com/blog/microsoft/</a></li>
    <li><a href="https://www.semafor.com/article/01/09/2023/microsoft-eyes-10-billion-bet-on-chatgpt">[2] https://www.semafor.com/article/01/09/2023/microsoft-eyes-10-billion-bet-on-chatgpt</a></li>
    <li><a href="https://the-decoder.com/chatgpt-vs-google-who-wins-at-500-searches/">[3] https://the-decoder.com/chatgpt-vs-google-who-wins-at-500-searches/</a></li>
    <li><a href="https://twitter.com/sama/status/1601731295792414720">[4] https://twitter.com/sama/status/1601731295792414720</a></li>
    <li><a href="https://twitter.com/spiantado/status/1599462375887114240">[5] https://twitter.com/spiantado/status/1599462375887114240</a></li>
    <li><a href="https://twitter.com/SergeyI49013776/status/1598430479878856737">[6] https://twitter.com/SergeyI49013776/status/1598430479878856737</a></li>
    <li><a href="https://davidrozado.substack.com/p/what-is-the-iq-of-chatgpt">[7] https://davidrozado.substack.com/p/what-is-the-iq-of-chatgpt</a></li>
    <li><a href="https://www.theverge.com/2023/1/9/23546144/microsoft-openai-word-powerpoint-outlook-gpt-integration-rumor">[8] https://www.theverge.com/2023/1/9/23546144/microsoft-openai-word-powerpoint-outlook-gpt-integration-rumor</a></li>
    <li><a href="https://ai.googleblog.com/2022/04/pathways-language-model-palm-scaling-to.html">[9] https://ai.googleblog.com/2022/04/pathways-language-model-palm-scaling-to.html</a></li>
    <li><a href="https://news.ycombinator.com/item?id=33820750">[10] https://news.ycombinator.com/item?id=33820750</a></li>
    <li><a href="https://www.govtech.com/education/k-12/new-york-city-department-of-education-bans-chatgpt#:~:text=The New York City Department of Education has banned access,potential to undermine student learning.">[11] https://www.govtech.com/education/k-12/new-york-city-department-of-education-bans-chatgpt#:~:text=The New York City Department of Education has banned access,potential to undermine student learning.</a></li>
    <li><a href="https://the-decoder.com/google-may-use-deepminds-sparrow-as-chatgpt-competitor/#:~:text=Deepmind introduced Sparrow in September,date information into its responses">[12] https://the-decoder.com/google-may-use-deepminds-sparrow-as-chatgpt-competitor/#:~:text=Deepmind introduced Sparrow in September,date information into its responses</a></li>
</ul>

            </section>
            </article>
        </main>
        </div>
  </template>

