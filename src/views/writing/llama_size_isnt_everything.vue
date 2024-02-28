<template>
    <div class="blog-container">
      <main class="blog-main">
        <article>
          <h1>Size Isn't Everything - How LLaMA democratizes access to Large-Language-Models</h1>
          <hr>
          <section>


            <p>Recently, Meta announced the release of a new AI language generator called LLaMA. While tech enthusiasts have been primarily focused on language models developed by Microsoft, Google, and OpenAI, LLaMA is a research tool designed to help researchers advance their work in the subfield of AI. In this blog post, we will explain how LLaMA is helping to democratize large language models.</p>

<p>LLaMA is a large language model introduced by Meta to push the boundaries of what smaller language models can do. It is based on traditional transformer architecture and includes some recent training advances such as Pre-normalization (as seen in GPT-3), SwiGLU activation function (used in PaLM), and Rotary Embeddings (applied in GPTNeo). The model comes in four different sizes: 7B, 13B, 33B, and 65B parameters.</p>

<p>All sizes perform extremely well compared to the current state of the art while having fewer parameters. For example, LLaMA-13B performed better than GPT-3 (175B) in most tests or evaluations despite being more than 10× smaller. On the other hand, LLaMA-65B, is comparable to some of the best-performing models such as Chinchilla70B and PaLM-540B.</p>

<table>
    <thead>
        <tr>
            <th>Model size</th>
            <th>BoolQ</th>
            <th>PIQA</th>
            <th>SIQA</th>
            <th>HellaSwag</th>
            <th>WinoGrande</th>
            <th>ARC-e</th>
            <th>ARC-c</th>
            <th>OBQA</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GPT-3 175B</td>
            <td>60.5</td>
            <td>81.0</td>
            <td>-</td>
            <td>78.9</td>
            <td>70.2</td>
            <td>68.8</td>
            <td>51.4</td>
            <td>57.6</td>
        </tr>
        <tr>
            <td>Gopher 280B</td>
            <td>79.3</td>
            <td>81.8</td>
            <td>50.6</td>
            <td>79.2</td>
            <td>70.1</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td>Chinchilla 70B</td>
            <td>83.7</td>
            <td>81.8</td>
            <td>51.3</td>
            <td>80.8</td>
            <td>74.9</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td>PaLM 62B</td>
            <td>84.8</td>
            <td>80.5</td>
            <td>-</td>
            <td>79.7</td>
            <td>77.0</td>
            <td>75.2</td>
            <td>52.5</td>
            <td>50.4</td>
        </tr>
        <tr>
            <td>PaLM-cont 62B</td>
            <td>83.9</td>
            <td>81.4</td>
            <td>-</td>
            <td>80.6</td>
            <td>77.0</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
        <tr>
            <td>PaLM 540B</td>
            <td>88.0</td>
            <td>82.3</td>
            <td>-</td>
            <td>83.4</td>
            <td>81.1</td>
            <td>76.6</td>
            <td>53.0</td>
            <td>53.4</td>
        </tr>
        <tr>
            <td>LLaMA 7B</td>
            <td>76.5</td>
            <td>79.8</td>
            <td>48.9</td>
            <td>76.1</td>
            <td>70.1</td>
            <td>72.8</td>
            <td>47.6</td>
            <td>57.2</td>
        </tr>
        <tr>
            <td>LLaMA 13B</td>
            <td>78.1</td>
            <td>80.1</td>
            <td>50.4</td>
            <td>79.2</td>
            <td>73.0</td>
            <td>74.8</td>
            <td>52.7</td>
            <td>56.4</td>
        </tr>
        <tr>
            <td>LLaMA 33B</td>
            <td>83.1</td>
            <td>82.3</td>
            <td>50.4</td>
            <td>82.8</td>
            <td>76.0</td>
            <td>80.0</td>
            <td>57.8</td>
            <td>58.6</td>
        </tr>
        <tr>
            <td>LLaMA 65B</td>
            <td>85.3</td>
            <td>82.8</td>
            <td>52.3</td>
            <td>84.2</td>
            <td>77.0</td>
            <td>78.9</td>
            <td>56.0</td>
            <td>60.2</td>
        </tr>
    </tbody>
</table>
<!-- END: ed8c6549bwf9 -->
<p class="centered">Zero-shot performance on Common Sense Reasoning tasks. Higher scores are better.</p>

<h2>Why bigger is not better?</h2>
<p>Achieving state-of-the-art results with magnitude less of parameter sizes is a huge accomplishment and is beneficial for both research and industry use cases. By reducing the computational resources required for training and inference, smaller models are more accessible to researchers and practitioners with limited resources. This means that language models can become a part of our daily workflows with ease. Do you want ChatGPT integrated into your home assistant? This is what we need to make that happen.</p>

<p>Moreover, smaller models are less prone to overfitting and more capable of generalizing to new data, making them dependable and robust in real-world settings. These models are not only energy efficient but also reduce the environmental impact of training and deploying them.</p>

<p>Larger models still outperform smaller ones, as shown by the better results achieved by the bigger LLaMA size (65B) in the first table. However, practicality is a key consideration, and smaller models are often more useful for retraining with recent data or fine-tuning for specific tasks. These adjustments can yield greater improvements than simply increasing model size, and smaller models are easier to work with than larger ones. In fact, it would only cost a tenth of the resources to train a 7B LLaMA compared to a 65B one, as shown in the table.</p>

<table>
    <thead>
        <tr>
            <th>GPU-hours</th>
            <th>Total power Consumption</th>
            <th>Carbon emitted (tCO2eq)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>OPT-175B</td>
            <td>809,472</td>
            <td>356 MWh</td>
        </tr>
        <tr>
            <td>BLOOM-175B</td>
            <td>1,082,880</td>
            <td>475 MWh</td>
        </tr>
        <tr>
            <td>LLAMA-7B</td>
            <td>82,432</td>
            <td>36 MWh</td>
        </tr>
        <tr>
            <td>LLaMA-13B</td>
            <td>135,168</td>
            <td>59 MWh</td>
        </tr>
        <tr>
            <td>LLaMA-33B</td>
            <td>530,432</td>
            <td>233 MWh</td>
        </tr>
        <tr>
            <td>LLAMA-65B</td>
            <td>1,022,362</td>
            <td>449 MWh</td>
        </tr>
    </tbody>
</table>
<h2>Bias evaluation</h2>
<p>The potential for biases in AI language models is a serious concern. It's why companies are cautious when adopting them for production systems. Take Google, for instance. Despite impressive academic work around large language models, they were slow productionize AI models until OpenAI’s ChatGPT came along. Google clearly had the AI innovations, infrastructure, talent, and distribution to release Bard AI earlier, but potentially because of the bias issues the risk wasn’t worth it until there was a competitor like ChatGPT.</p>

<p>The Meta AI team put LLaMA to the test to see if it exhibited any biases towards gender, religion, race, sexual orientation, age, nationality, disability, physical appearance, or socio-economic status. They also measured how toxic the model's responses using PerspectiveAPI, an open API to measure toxicity.</p>

<p>To measure biases, the researchers used stereotypical sentences related to a topic and measured the model's preference using perplexity in a zero-shot setting. Higher scores indicate greater biases. The LLaMA model had the lowest average bias score of 66.6 across all categories, but the score varied in each category. The model had the lowest bias score of 57 for race/color, which is excellent. However, it had the highest bias score of 81 for sexual orientation, which is not so good.</p>

<table>
    <thead>
        <tr>
            <th>LLaMA</th>
            <th>GPT3</th>
            <th>OPT</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Gender</td>
            <td>70.6</td>
            <td>62.6</td>
        </tr>
        <tr>
            <td>Religion</td>
            <td>79.0</td>
            <td>73.3</td>
        </tr>
        <tr>
            <td>Race/Color</td>
            <td>57.0</td>
            <td>64.7</td>
        </tr>
        <tr>
            <td>Sexual orientation</td>
            <td>81.0</td>
            <td>76.2</td>
        </tr>
        <tr>
            <td>Age</td>
            <td>70.1</td>
            <td>64.4</td>
        </tr>
        <tr>
            <td>Nationality</td>
            <td>64.2</td>
            <td>61.6</td>
        </tr>
        <tr>
            <td>Disability</td>
            <td>66.7</td>
            <td>76.7</td>
        </tr>
        <tr>
            <td>Physical appearance</td>
            <td>77.8</td>
            <td>74.6</td>
        </tr>
        <tr>
            <td>Socioeconomic status</td>
            <td>71.5</td>
            <td>73.8</td>
        </tr>
        <tr>
            <td>Average</td>
            <td>66.6</td>
            <td>67.2</td>
        </tr>
    </tbody>
</table>
<h2>Dataset</h2>
<p>In contrast to other big Language Models that use private data to expand their datasets LLaMA is only trained on publicly available data, compatible with open-source. Used datasets</p>

<table>
    <thead>
        <tr>
            <th>Dataset</th>
            <th>Sampling prop.</th>
            <th>Epochs</th>
            <th>Disk size</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>CommonCrawl</td>
            <td>67.00%</td>
            <td>1.1</td>
            <td>3.3 TB</td>
        </tr>
        <tr>
            <td>C4</td>
            <td>15.00%</td>
            <td>1.06</td>
            <td>783 GB</td>
        </tr>
        <tr>
            <td>Github</td>
            <td>4.50%</td>
            <td>0.64</td>
            <td>328 GB</td>
        </tr>
        <tr>
            <td>Wikipedia</td>
            <td>4.50%</td>
            <td>2.45</td>
            <td>83 GB</td>
        </tr>
        <tr>
            <td>Books</td>
            <td>4.50%</td>
            <td>2.23</td>
            <td>85 GB</td>
        </tr>
        <tr>
            <td>ArXiv</td>
            <td>2.50%</td>
            <td>1.06</td>
            <td>92 GB</td>
        </tr>
        <tr>
            <td>StackExchange</td>
            <td>2.00%</td>
            <td>1.03</td>
            <td>78 GB</td>
        </tr>
        <tr>
            <td>Physical appearance</td>
            <td>77.8</td>
            <td>74.6</td>
            <td>76.2</td>
        </tr>
        <tr>
            <td>Socioeconomic status</td>
            <td>71.5</td>
            <td>73.8</td>
            <td>76.2</td>
        </tr>
        <tr>
            <td>Average</td>
            <td>66.6</td>
            <td>67.2</td>
            <td>69.5</td>
        </tr>
    </tbody>
</table>
<p>Datasets include data in 20 different languages, but due to the majority of the training data being English, it is expected to perform better in English than in other languages. The FAIR team also found that the model's performance may vary for different dialects.</p>

<h2>Open-source access</h2>
<p>The model is open by request at the following form. If you get access you would need to clone the provided repository facebookresearch/llama and follow their instructions.</p>

<h2>Conclusion</h2>
<p>The LLaMA model represents a significant breakthrough for natural language processing, with exciting implications for both research and industry. By reducing model complexity and footprint, we can make this technology more accessible to a wider range of industries. Recent research, however, has been focused on increasing model performance at the cost of model size - like the 540B PaLM model.</p>

<p>Thankfully, the 13B LLaMA model has shown that smaller models can outperform their larger counterparts like GPT-3, effectively flipping the script on the size-to-performance ratio. Not only that, but LLaMA also has lower biases compared to other language models. This breakthrough demonstrates that it's possible to achieve impressive results with smaller models while also reducing the risk of perpetuating harmful biases. This paves the way for more accessible and practical applications of natural language processing that are more inclusive and trustworthy.</p>



















        </section>
        </article>
      </main>
    </div>
  </template>

<script>
export default {
    name: 'BlogPostLLaMA',
}
</script>

<style>
.table {
    width: 100%;
    border: 1px solid black;
    text-align: center;
    margin: auto;
    background-color: #f40000;
}
</style>