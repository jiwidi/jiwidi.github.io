<template>
    <div class="blog-container">
      <main class="blog-main">
        <article>
          <h1>GPT-4: A New Milestone in Scaling Up Deep Learning</h1>
          <hr>
          <section>

            <p>OpenAI has recently announced the creation of its latest deep learning model, GPT-4. It is a large multimodal model that accepts image and text inputs and outputs text. While GPT-4 is not as capable as humans in many real-world scenarios, it has shown human-level performance on various professional and academic benchmarks.</p>

<h2>Access to GPT-4</h2>
<p>GPT-4's text input capability is now available via ChatGPT Plus and the API, with a waitlist. OpenAI is also collaborating closely with a single partner to prepare the image input capability for wider availability. Additionally, OpenAI is open-sourcing OpenAI Evals, their framework for automated evaluation of AI model performance, to allow anyone to report shortcomings in their models to help guide further improvements.</p>

<h2>GPT-4's Capabilities</h2>
<p>GPT-4 is a multimodal model that can accept both image and text inputs and generate text outputs. While it is not as capable as humans in real-world scenarios, it has achieved human-level performance on several academic and professional benchmarks.</p>

<p>OpenAI tested them on a variety of benchmarks, including simulating exams that were originally designed for humans. They tested GPT-4 using the most recent publicly-available tests (in the case of the Olympiads and AP free response questions) or by purchasing 2022–2023 editions of practice exams. OpenAI did no specific training for these exams. A minority of the problems in the exams were seen by the model during training, but they believe the results to be representative.</p>

<img src="/src/assets/img/writing/gpt4/1.png" alt="GPT-4: A New Milestone in Scaling Up Deep Learning" class="img-fluid">

<p>GPT-4 has shown better performance than GPT-3.5 on the benchmarks, exhibiting human-level performance on various professional and academic exams, such as passing a simulated bar exam with a score around the top 10% of test takers. In contrast, GPT-3.5's score was around the bottom 10%.</p>

<p>OpenAI has also shared the estimated percentile lower bound among test-takers for each exam. The results showed that GPT-4 performed better than GPT-3.5 in all the tests. For example, GPT-4 scored 298 out of 400 on the Uniform Bar Exam (MBE+MEE+MPT), which is around the 90th percentile, while GPT-3.5 scored 213 out of 400, around the 10th percentile. The results demonstrate the significant improvement that GPT-4 has achieved over its predecessor.</p>

<p>GPT-4 scored high on traditional machine learning benchmarks, outperforming existing large language models.</p>


<h2>Safety and alignment</h2>
<p>In addition to its advanced language processing capabilities, GPT-4 is designed with safety and alignment in mind. OpenAI spent six months making the model safer and more aligned, resulting in a system that is 82% less likely to respond to requests for disallowed content and 40% more likely to produce factual responses than GPT-3.5 on internal evaluations. OpenAI achieved this by incorporating more human feedback, including feedback from ChatGPT users, and working with over 50 experts in domains such as AI safety and security.</p>

<h2>Built with GPT-4</h2>
<p>OpenAI has released some information about companies that are already integrating ChatGPT in their product, some of them are:</p>

<ul>
    <li>Duolingo</li>
    <li>Be My Eyes</li>
    <li>Stripe</li>
    <li>Morgan Stanley</li>
    <li>Government of Iceland</li>
    <li>Conclusion</li>
</ul>
<h2>Conclusion</h2>
<p>GPT-4 is the latest achievement in OpenAI's efforts to scale up deep learning. It is a large multimodal model that has achieved human-level performance on various academic and professional benchmarks. Although it is still far from perfect, it exhibits improved factuality, steerability, and adherence to guardrails, making it more reliable, creative, and able to handle nuanced instructions than its predecessor, GPT-3.5. We are excited to see what GPT4 brings after seeing the hype and incredible amount of products that raised from ChatGPT.</p>



        </section>
        </article>
      </main>
    </div>
  </template>

<script>
export default {
    name: 'BlogPostGPT4',
}
</script>
