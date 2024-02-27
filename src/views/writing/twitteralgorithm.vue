<template>
    <div class="about-container">
      <main class="shadowPlus4">
        <article>
          <h1>Twitter's Open Source Algorithm - Unveiling the code, but not the secrets</h1>
          <hr>
          <section>
            <p>The tech mogul has been teasing the release of "the algorithm" since taking over Twitter, leading many to anticipate a comprehensive unveiling of the platform's promotion strategies. However, the release turned out to be more of a smoke and mirrors display than a grand reveal. This post delves into Twitter's recommendation system, emphasizing that they have only released the model pipeline training, rather than providing insight into why specific recommendations appear on users' timelines, as many had expected.</p>

<h2>The false hype</h2>
<p>Musk's advocacy for open-sourcing the algorithm might have led some users to expect that it would disclose the weights or reasons behind the promotion of certain Tweets. However, Twitter's recent open-source release of their recommendation system only focused on the model training pipeline, excluding the specific weights or criteria used to determine which Tweets are promoted. This distinction is crucial, as while the release provides insight into the overall structure and process of the algorithm, it does not offer complete transparency into the precise factors affecting the prominence of individual Tweets on the platform.</p>

<h2>What has been released</h2>
<p>Twitter's recommendation system consists of a four-stage process, which closely resembles the one used at Shaped. The system operates by collecting the most pertinent Tweets from different sources (candidate sourcing), ranking each Tweet using a machine learning model, applying heuristics and filters, and finally, constructing and serving the For You timeline through the Home Mixer. Although the released system presents valuable insights for developers on building a recommender system, it does not provide Twitter's internal data, resulting in some disappointment among users who were seeking increased transparency.</p>

<h3>1 - Candidate Sourcing</h3>
<p>Candidate sourcing is carried out through In-Network and Out-of-Network sources. The In-Network source focuses on the most relevant and recent Tweets from users you follow, while Out-of-Network sources find pertinent Tweets outside your network using Social Graph and Embedding Spaces. Social Graph analyzes engagements of people you follow or those with similar interests, and Embedding Spaces computes numerical representations of users' interests and Tweets' content to establish content similarity.</p>
<img src="/src/assets/img/writing/twitter/1.jpeg" alt="Twitter's Open Source Algorithm - Unveiling the code, but not the secrets" class="img-fluid">
<p>With the release of this component, some of the features used by the system have been disclosed and confirmed rumors regarding Musk receiving special treatment for his tweets after taking over the company.</p>


<h3>2 - Ranking</h3>
<p>The Ranking stage in Twitter's recommendation system is a crucial step where each Tweet is assigned a score based on its predicted relevance to the user. This process is executed using a neural network with approximately 48 million parameters, which is continuously trained on Tweet interactions to optimize for positive engagements such as Likes, Retweets, and Replies. The model takes into account thousands of features and generates ten labels for each Tweet, representing the probability of different types of engagement. The scores derived from these labels are then utilized to rank the Tweets in order of relevance. By effectively ranking Tweets, the system ensures that the content displayed on a user's timeline is tailored to their interests, creating a personalized and engaging experience on the platform.</p>

<h3>3 - Filtering</h3>
<p>In the Filtering stage of Twitter's recommendation system, various heuristics and filters are applied to the curated content to enhance the user experience by implementing product features that cater to individual preferences. These filters help create a balanced and diverse feed, ensuring that users are presented with a personalized and engaging timeline. Some examples of filters applied at this stage include Visibility Filtering, which removes Tweets from accounts a user has blocked or muted; Author Diversity, which prevents too many consecutive Tweets from the same author; and Content Balance, which ensures a fair distribution of In-Network and Out-of-Network Tweets.</p>

<h3>4 - Mixing and Serving</h3>
<p>The Home Mixer is responsible for blending these Tweets with other non-Tweet content, such as Ads, Follow Recommendations, and Onboarding prompts. This combination ensures a diverse and engaging user experience on the platform. Once the Home Mixer has compiled the right mix of content, it sends the finalized For You timeline to users' devices for display, providing them with a curated and personalized feed that meets their interests and preferences.</p>

<h2>Aftermath</h2>
<p>While Twitter's open-source release of their recommendation system offers insight into the underlying mechanics of content curation, it is important to note that they have not disclosed the weights that determine specific content appearances in the pipeline, something that was hinted at by Musk's promises. This recommender system plays a crucial role in creating an engaging and personalized experience for Twitter users, and its open-source release marks a step towards increased transparency.</p>












        </section>
        </article>
      </main>
    </div>
  </template>

<script>
</script>
