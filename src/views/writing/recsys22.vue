<template>
    <div class="blog-container">
      <main class="blog-main">
        <article>
          <h1>RecSys 22 - Favorite papers and talks</h1>
          <hr>
          <section>


            <h2>Denoising Self-Attentive Sequential Recommendation</h2>
<p>Authors: Huiyuan Chen, Yusan Lin, Menghai Pan, Lan Wang, Chin-Chia Michael Yeh, Xiaoting Li, Yan Zheng, Fei Wang, Hao Yang</p>

<p>Lab: Visa Research</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3546788</p>

<p>First off, we have one of the best paper awards for the conference. This paper proposes the Rec-Denoiser model, a method that aims to mitigate problems with noisy historical interactions affecting recommendations (specifically for Transformer-based sequential models). For example, if you accidentally like a post that you’re not interested in, the recommendation model aims to adaptively ignore that noisy interaction.</p>

<p>Rec-Denoiser works by, simply, attaching a trainable binary mask that prunes noisy attentions from each of the Transformer’s self-attention layers, resulting in sparse and clean attention distributions. The novelty of the paper comes from how they adaptively learn the binary mask, given that it’s non-differentiable (i.e. the loss is discontinuous) and has large variance (i.e too many possible binary mask states). To overcome this they propose an efficient estimator that uses a variant of the augment-REINFORCE-merge (APM) [1] method to relax the optimization. Furthermore they add Jacobian regularization to enforce a local Lipschitz constraint to further improve robustness.</p>

<p>The experimental results demonstrate significant improvements that Rec-Denoiser brings to self-attentive recommenders (5.05% ∼ 19.55% performance gains), as well as its robustness against input perturbations.</p>

<p>[1] Mingzhang Yin and Mingyuan Zhou. 2019. ARM: Augment-REINFORCE-mergegradient for stochastic binary networks. In ICLR.</p>

<h2>A Systematic Review and Replicability Study of BERT4Rec for Sequential Recommendation</h2>
<p>Authors: Aleksandr Petrov, Craig Macdonald</p>

<p>Lab: University of Glasgow</p>

<p>Code: github.com/asash/bert4rec_repo</p>

<p>Link: https://arxiv.org/pdf/2207.07483.pdf</p>

<p>The authors noticed discrepancies in BERT4rec results when doing a literature review on Transformer sequential models. To get to the bottom of it, they systematically reviewed BERT4Rec and SASRec results across 370 papers that cite the original BERT4Rec paper. Their analysis found that there were 3 common BERT implementations, 2 of these had performance issues, and the original implementation’s default config was severely underfitting. The authors also wrote their own implementation of BERT4Rec using the HuggingFace Transformer library, and showed superior performance to the original implementation. They present their own results along with what they achieved by using the most popular BERT4rec repositories on GitHub.</p>

<p>Not stopping there, they then tried several more recent BERT style models (ALBERT, DeBERTa) from HuggingFace and further improved results. See the results below:</p>


‍

<h2>Learning Users’ Preferred Visual Styles in an Image Marketplace (Shutterstock)</h2>
<p>Authors: Raul Gomez Bruballa, Lauren Burnham-King, Alessandra Sala</p>

<p>Lab: Shutterstock</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3547382</p>

<p>Providing meaningful recommendations in a content marketplace is challenging due to the fact that users are not the final content consumers. Instead, most users are creatives whose interests, linked to the projects they work on, change rapidly and abruptly.</p>

<p>To address the challenging task of recommending images to content creators,author’s proposed a RecSys model that learns visual styles preferences transversalto the semantics of the project’s users work on. They analyze the challenges of the task compared to content-based recommendations driven by semantics, propose an evaluation setup, and explain its applications in a global image marketplace.</p>

<p>They present the ShutterStock search pipeline:</p>


<p>Where a user queries the search engine, which returns non-personalized results matching thequery semantics (in the example, "people"). Then, Visual Styles RecSys re-ranks those results, and the ones inline with the user preferred visual styles are shown first, similar to a traditional retrieval-scoring setup.</p>

<p>Their model Visual Styles RecSys:</p>


<p>In blue are layers of the user encoder, and in green are layers of the image encoder. MLP(Multi Layer Perception) layers are linear layers with ReLU activations, and DCN (Deep Cross Network) layers are Cross layers. Reminds us of the original NCF model.</p>

<p>They only presented results against a Popularity baseline. Improving classification metrics and coverage but worse Visual Diversity. Visual diversity is a metric based on the distance within deep representations and of recommended items, is expected to decrease as the model now is learning features in contrary to the popularity model where features play a less impactful role.</p>


<p>Author’s use negative sampling (not mentioned in paper but we talked with them in the venue). They select negative samples for each user as items interacted by other users within the batch. This method will be biased towards popularity as the negative sampling will now follow the item popularity distribution. We would love to see future work where other methods used in RecSys are evaluated.</p>

<h2>Personalizing Benefits Allocation Without Spending Money (booking.com)</h2>
<p>Authors: Dmitri Goldenberg, Javier Albert</p>

Lab: Booking

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3547381</p>

<p>Ad campaigns are often run powered by recommender systems and have a limited budget. Optimizing who to target becomes part of the loss function along with what items to recommend.</p>

<p>In this talk, the authors focus on what customers are more best to provide an offer and how to find them. This customers would often not not create bookings unless discounts are given to them. By targeting this customers first booking increased customer conversation rate while using lower ad campaigns. This allowed them to generate more revenue from the initial customers and increase the total budget, to finally target a bigger customer base than they would have if they didn’t initially target customers.</p>

<h2>Aspect Re-distribution for Learning Better Item Embeddings in Sequential Recommendation</h2>
<p>Authors: Wei Cai, Weike Pan, Zhechao Yu, Congfu Xu, Jingwen Mao</p>

<p>Lab: Zhejiang University & Shenzen University</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3546764</p>

<p>In this paper, the authors aim to reduce bias present in item embeddings learn on sequence models. They do this by representing an item using several aspect embeddings with the same initial importance. The importance of each aspect is then recalculated according to other items in the sequence. The aspect-aware embedding can be provided as input to a successor sequential model. The full proposed architecture is called aspect re-distribution (ARD) and uses SASRec as the successor sequential model.</p>


<p>The left part: First, the embeddings (blue node) of each item is decomposed under some constraints into the aspect embeddings. Next, the aspect embeddings are aggregated into an aspect-aware item embedding. Finally, the sequence embedding (yellow node) is calculated from the aspect-aware item embeddings using SASRec[1], with which the relevance of the candidate item being the next item can be calculated.</p>

<p>The right part: Take the generation of aspect-aware item embedding of item k as an example, all aspect embeddings of the previous items (i.e., items 1, 2, . . . , k − 1) are accumulated (gray box). Then, the aspect distribution (grey rectangles) of item k is calculated. Finally, the aspect embeddings of item k are aggregated into an aspect-aware item embedding accordingto the aspect distribution.</p>

<p>Their results show an uplift across different datasets against their baseline (SASRec) and other series of sequential models.</p>


<h2>Recommendation as Language Processing (RLP): A Unified Pretrain, Personalized Prompt & Predict Paradigm (P5)</h2>
<p>Authors: Shijie Geng, Shuchang Liu, Zuohui Fu, Yingqiang Ge, Yongfeng Zhang</p>

<p>Lab: Rutgers University</p>

<p>Link: https://arxiv.org/abs/2203.13366‍</p>

<p>The authors bring the power of large language models into the RecSys ecosystem. They present P5, a unified pretrain, personalized prompt & predict paradigm built on top of T5 checkpoints. It uses all data including user-item interactions, item metadata, and user reviews are converts them to a common format — natural language using prompt templates.</p>

<p>This new data formulation allow the authors to train P5 as a multi-task recommender where different 47 personalized prompts to cover 5 task families are used for training.</p>


<p>Each prompt consist of input–target pairs from raw data - simply substituting the fields in the prompts with the corresponding information. The raw data for the five task families of P5are from three separate sources. Specifically, rating/review/explanation prompts (a) have shared raw data. Sequential recommendation (b) and direct recommendation (c) uses similar raw data, but the former particularly requires the user interaction history.</p>

<p>By treating all different task as a text generation problem it possesses the potential to serve as the foundation model for downstream recommendation tasks, allows easy integration with other modalities, and enables a unified recommendation engine.</p>


<p>Their results show similar or better performance across multiple task when compared to specific trained models, with biggest uplifts on the sequential use-case. Visit their paper for more detailed table results.</p>

<p>We are very excited about this paper as it brings a new level of model generalization within the RecSys space and we are happy to give it our Shaped best paper award :)</p>

<h2>RADio – Rank-Aware Divergence Metrics to Measure Normative Diversity in News Recommendations</h2>
<p>Authors: Sanne Vrijenhoek∗, Gabriel Bénédict∗, Mateo Gutierrez Granada, Daan Odijk, Maarten de Rijke</p>

<p>Lab: University of Amsterdam, RTL Nederland B.V.</p>

<p>link: https://dl.acm.org/doi/pdf/10.1145/3523227.3546780</p>

<p>RADio introduces a rank-aware Jensen Shannon (JS ) divergence and experiments with diversity-aware news recommendations. The work is motivated by the gap between normative and descriptive diversity metrics. For example, traditional information retrieval diversity metrics likely wouldn’t be considered diverse according to the criteria maintained by newsroom editors.</p>

<p>The overall methodology they propose is as follows:</p>

<ul>
    <li>Collect metadata from a news dataset that reflects democratic norms that you want the recommendation algorithm to follow. This metadata can be collected manually or through an NLP pipeline.</li>
    <li>Compare discrete distributions of that metadata to a recommendation algorithm via a rank-aware divergence metric.</li>
    <li>The great thing about this process is that it gives data practitioners a way to tweak the trade-off between different target values in the recommendation, or even explicitly optimize on these normative metrics. For example, imagine a large media organization that wants to dedicate a small section of their website to a recommendation element titled “A different perspective”. They could optimize their metrics against DART’s [1] theoretical model of democracy to make informed decisions about which recommendation system is better suited to the normative stance they’re looking for.</li>
</ul>

<p>What is rank-aware f-Divergence?</p>

<p>f-Divergence is a generalization of divergence measures like Kullback–Leibler (KL) and Jensen–Shannon (JS). This work proposes rank-aware f-Divergence which adds an optional discount factor between the P and Q comparison distributions. They find that a Mean Reciprocal Rank (MRR) discount: MRR = 1 / R_i, works well. If one of the divergence distributions is just a set of items, the rank-aware weighting can be removed.</p>

<p>[1] Recommenders with a Mission: Assessing Diversity in News Recommendations, Sanne Vrijenhoek, et al. (2021).</p>

<h2>Countering Popularity Bias by Regularizing Score Differences</h2>
<p>Authors: Wondo Rhee, Sung Min Cho, Bongwon Suh‍</p>

<p>Lab: Dept. of Intelligence and Information & Dept. of Computer Science andEngineering .Seoul National University</p>

<p>link: https://dl.acm.org/doi/abs/10.1145/3523227.3546757</p>

<p>Authors motivate their work by discussing two biases present in today's matrix factorization methods:</p>

<ul>
    <li>Data: Long-tail distribution for item popularity.</li>
    <li>Model: Unfairly higher scores to popular items among items a user has equally liked.</li>
</ul>
<p>They then propose methods to handle model bias. Notably, they propose two regularization terms that aim to reduce model bias by giving equal scores to positive and negative items:</p>

<ul>
    <li>Pos2Neg2 Term - 2 positive and 2 negative items are sampled per user at a time and the score difference is minimized.</li>
    <li>Zerosum Term - 1 positive and 1 negative item is sampled and the sum is regularized to be close to 0.</li>
</ul>

<p>These plots show that the distribution of positive and negative scores is more symmetric than the baseline for both regularization terms.</p>

<p>The terms are experimented with by adding each term to a Bayesian Personalized Ranking (BPR) loss. For datasets where the baseline model performed well (i.e. Movielens, Gowella, Goodreads) ZeroSum generally had accuracy within a 2% error rate from the baseline and a generally improved debias metric (PopQ) compared to other debias methods and the baseline.</p>


<p>PRI and PopQ@1 (introduced in this paper) are popularity rank correlation metrics, that measure correlation of a ranking algorithm against a popular toplist. PD and Pearson are previous debiasing methods.</p>
<h2>Don’t recommend the obvious: estimate probability ratios</h2>
<p>Authors: Roberto Pellegrini, Wenjie Zhao, Iain Murray</p>

<p>Lab: Amazon</p>

<p>Link: https://www.amazon.science/publications/dont-recommend-the-obvious-estimate-probability-ratios</p>

<p>Recent papers evaluate recommendation systems with popularity-sampled metrics, which measure how well the model can find a user’s next item when hidden amongst generally-popular items. This paper shows that optimizing popularity-sampled metrics is closely related to estimating point-wise mutual information (PMI).</p>

<p>What is PMI? You can think of PMI as a measure of how much more likely two outcomes are to occur together compared to what we would expect by random chance assuming independence. It works by normalizing the conditional probability p(y | x) by the prior probability p(y). A PMI of zero, corresponding to a probability ratio of one, means that we won’t observe the outcomes x and y together more often than if they are independent. In contrast, a large positive value of the PMI implies a strong association between the outcomes. The reason it’s attractive score to rank items to recommend for a user is that it avoids recommending products that are not really personalized.</p>

<p>The authors then propose two methods to train a model that fits the PMI:</p>

<p>Train directly on the classification task but sample with replacement in proportion to the general popularity.</p>
<p>Embedded prior model. Estimate both the customer-specific predictions and the item popularity distribution separately and plug these into the ratio. There’s several ways these models could be constructed and trained, they use a neural network for convenience and experiment with training the models a) sequentially vs b) jointly vs c) using a loss that ignores the user-specific part when estimating the prior. They find that a) and c) are best.</p>
<p>Finally, they demonstrate that on the movielens dataset using the embedded prior model improves the popularity-sampled HIT@k metric by 5% for SasRec and BERT4Rec. And show that they recommend less popular products by evaluating the highest average index compared to the baseline.</p>


<p>Average Index@10 computes the average global popularity index for the top 10 ranked items.Type image caption here (optional)</p>
<h2>Recommending for a Multi-Sided Marketplace with Heterogeneous Contents</h2>
<p>Authors: Yuyan Wang, Long Tao,  Xian Xing Zhang</p>

<p>Lab: Uber</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3547379</p>

<p>Uber’s presents a recommender solution to their 3-sided marketplace for food delivery. Recommending restaurants to users on Uber eats while taking into account constraints and objectives from restaurants and delivery partners.</p>

<p>They propose a collection of machine learning models (MOHR) to balance between different objectives and serve recommendations to all groups.</p>


<p>MOHR has multiple steps:‍</p>

<!-- FILEPATH: /Users/jiwidi/projects/github/jiwidi.github.io/src/views/writing/recsys22.vue -->
<!-- BEGIN: ed8c6549bwf9 -->
<ul>
    <li>MO Multi-objective prediction for every (user, restaurant, source) triplet:
        <ul>
            <li>User level: Conversion (placing order) and retention (coming back).</li>
            <li>Company level: Basket value and other financial metrics.</li>
            <li>Marketplace fairness: Ensure marketplace exposure fairness.</li>
        </ul>
    </li>
    <li>H State based user browsing model:
        <ul>
            <li>State based user-browsing model to account for their limited patience. User state is modeled as their current viewing position with Markovian state transitions.</li>
            <li>Horizontal transition: continue browsing the next restaurant</li>
            <li>Vertical transition: abandon the current carousel</li>
            <li>Terminator: order from the current restaurant</li>
            <li>Carousel-level objectives can be expressed as a summation of the probability that a user order from a restaurant such that the user scrolls to the position of the carousel and restaurant.</li>
        </ul>
    </li>
    <li>R Multi objective optimization for ranking</li>
    <ul>
        <li>Maximize one of (conversion, retention, bookings, fairness) while constraining on the amount tolerable sacrifice for the others.</li>
        <li>This is a large scale linear programming problem. As the problem use Lagrange duality to solve the optimization.
 </li>
 <li>They initially were reductant to A/B test their method due to cost and risk of churn so they evaluated with offline replay method first, using random ranking data where restaurants are randomly shuffled and presented to the users. After initial positive results they moved to real A/B test and allude to being the current production model, increasing conversion and generating multiple millions of dollars.
</li>
    </ul>
</ul>


<h2>You Say Factorization Machine, I Say Neural Network – It’s All in the Activation</h2>
<p>Authors: Chen Almagor, Yedid Hoshen</p>

<p>Lab: The Hebrew University of Jerusalem</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3551499</p>

<p>Recommendation models like Wide & Deep, DeepFM have always had an inelegant feel to them as they’re essentially two architectures concatenated together to solve the problems of each other. This work proposes a more elegant formulation that combines these components into a unified architecture.</p>

<p>They introduce FiFa: Fieldwise factorized neural networks. The architecture can represent both modern factorization machines (FM) and ReLU neural networks (DNN) in a general form. Recovering FMs or DNNs then becomes a matter of modifying the activation functions. They then show that an activation function exists which can adaptively learn to select the optimal paradigm for each use case.</p>

<p>The results show that this improves both FM models, and DeepFM models on the Criteo and Avazu dataset.</p>


<h2>Revisiting the Performance of iALS on Item Recommendation Benchmarks</h2>
<p>Authors: Steffen Rendle, Li Zhang, Walid Krichene, Yehuda Koren</p>

<p>Link: https://doi.org/10.1145/3523227.3548486</p>

<p>Matrix factorization learned by implicit alternating least squares (iALS) is a popular baseline in recommender system research. It is known to be one of the most computationally efficient and scalable collaborative filtering methods. However, recent studies suggest that its prediction quality is not competitive with the current state-of-the-art, such as autoencoders and other item-based collaborative filtering methods. The authors revisit the well-studied benchmarks where iALS was reported to perform poorly and show that with proper tuning its performance is comparable with state-of-the-art methods.</p>

<p>Results for MovieLens 20M:</p>


<p>Million Song dataset:</p>


<p>The In order to achieve these results multiple iALS hyperparameters are tuned, they provide recommendations on what values to use:</p>

<!-- FILEPATH: /Users/jiwidi/projects/github/jiwidi.github.io/src/views/writing/recsys22.vue -->
<!-- BEGIN: ed8c6549bwf9 -->
<ul>
    <li>Num iterations: How many times it trains on the data, typically converged in 16-20 iterations.</li>
    <li>Embedding dimensions: Controls capacity of the model, if it's too small it will negatively affect model performance. Training cost scales in d^3.</li>
    <li>Standard deviation: not too sensitive to this parameter, the typical value 1 / sqrt(embedding dimensions)</li>
    <li>Unobserved weight (weight of unobserved value) and regularization weight: Crucial, important to tune carefully, recommend to search on a logarithmic grid to determine the appropriate scale, then do a more refined search.</li>
    <li>Regularization regularization exponent: Reparameterization to decouple lambda and v, their optimal value was frequently 1.</li>
</ul>
<!-- END: ed8c6549bwf9 -->
‍

<h2>Adversary or Friend? An adversarial Approach to Improving Recommender Systems</h2>
<p>Authors: Pannaga Shivaswamy, Dario Garcia-Garcia</p>

<p>Lab: Netflix</p>

<p>Link: https://dl.acm.org/doi/pdf/10.1145/3523227.3546784</p>

<p>Typical recommender systems models are trained to have good average performance across all users or items. In practice, this results in model performance that is good for some users but sub-optimal for many users. This work investigates the use of adversarial models/objectives to solve this in-balance in performance.</p>

<p>They apply what’s called an adversarial reweighted learning (ARL) model to gives more emphasis to dense areas of the feature-space that incur high loss during training and such should correspond to the sub-optimal performing users.</p>

<p>They formulate an ARL loss as follows:</p>


<p>The intuition here is that the adversarial model output weight (green) will be higher when the adversary expects the training loss (red) to be higher. The adversarial model regularization (pink), is both the l2 loss (at the end of the equation) and a normalization of adversary weights such that they sum to one over all examples (the divider of the first term), are critical to ensure it’s possible for the objective to be learnable. Note, EASE is a state-of-the-art collaborative filtering model, and the EASE objective above just refers to the non regularization terms from the Lagrangian objective function.</p>

<p>To optimize this objective they first train SGD on the learner and adversary model jointly. They then go on to propose a rank-loss adversarial model (R-LARM) that better fits the ranking objective by taking the gradient directly on an NDCG loss.</p>

<p>They experiment on the ML20M, Netflix and MSD datasets. The results demonstrate that not only is R-LARM best in aggregate but it also helps for every interaction percentile bucket of users.</p>


‍

‍

<h2>Augmenting Netflix Search with In-Session Adapted Recommendations</h2>
<p>Authors: Moumita Bhattacharya, Sudarshan Lamkhede</p>

<p>Lab: Netflix</p>

<p>Link: https://arxiv.org/pdf/2206.02254.pdf</p>

<p>Users at Netflix expect personalized feeds across different usage of the app. This work provide a comprehensive view of how multiple recommendation systems complement each other to build these personalized experience. It provides an overview of an end-to-end in-session adaptive recommendations system and discusses their findings when deploying it at scale.</p>

<p>Some of Netflix’s recommendation use-cases are:</p>

<ul>
    <li>Homepage feed — Collection of different carousels and ranking systems</li>
    <li>Search — Fetch, find, explore across the Netflix catalog given a query</li>
    <li>Pre-query recommendations — Pre-query recommendations. e.g. pre-query: profile → title. They try to predict what the authors want.</li>
</ul>

<p>In the system they describe, they store long term preferences as past interactions and short term preferences as current session information. They combine both of these data sources before feeding them to their model.</p>

<p>They highlight the effects of using short term data (session data) as it helps produce fresher recommendations with higher diversity and novelty. It helps them find what the user currently wants even if the user has very few data points in their system, the current session is enough to produce recommendations. All of these benefits help increase overall member satisfaction and reduce the number of abandoned sessions.</p>

‍

<h2>An Incremental Learning framework for large-scale CTR prediction</h2>
<p>Authors: Petros Katsileros, Nikiforos Mandilaras, Dimitrios Mallis, Vassilis Pitsikalis, Stavros Theodorakis, Gil Chamiel.</p>

<p>Lab: Deeplab, Taboola</p>

<p>Link: https://arxiv.org/pdf/2209.00458.pdf</p>

<p>Authors present an incremental learning framework for CTR prediction through the rapid deployment of fresh models. They achieved this by implementing a warm-start from past-deployed models with a teacher-student paradigm.</p>


<p>During training, a teacher-student paradigm, where the teacher (trained daily) acts as an implicit regularizer, enables the student to maintain previously acquired knowledge.</p>

<p>Previously training each model from scratch on historical user impressions resulted in long training times, model freshness issues as new trends emerged (that were not captured by historical data), and intensive computing resources.</p>

‍








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
