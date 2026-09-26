# Deep Learning Era of AI, 2012–2021 (Unhyped timeline dataset, file 02)

Scope: 2012-01-01 to 2021-12-31. Some entries mention what happened after 2021 (Watson Health sale in 2022, radiologist workforce in 2026) only to fill the "what actually happened" field. Every entry has a source_url that points to the primary artifact (arXiv, Nature, lab blog, GitHub repo, press release) or to reputable journalism.

Verification note for the report writer: this pass directly checked (via search/fetch) the hype quotes and their aftermath, the Watson Health record, Duplex human-call rates, the Tesla/Ford self-driving predictions, the AlphaFold CASP14 score, and the Tay apology. The timeline entries' source URLs are canonical primary links (arXiv IDs, Nature DOIs, official repos/blogs) from domain knowledge. They were NOT all fetched one by one in this session, so run a link-check before publishing. Anything I could not confirm is flagged "(verify)" or listed under Gaps.

Field key used below: `date | type | era | primary_segment | secondary_segments | stack_layer`, then creators, description, capability_note, edges, source_url, hero. Era codes: 3 = Machines learn patterns, 4 = Machines see & hear, 5 = Machines write.

---

## Q1. Timeline entries (2012–2021): what systems could demonstrably do

### Takeaway
The decade runs from supervised perception (AlexNet 2012), through deep RL (DQN, AlphaGo) and sequence models, to the Transformer (2017). The Transformer then enabled pretrained language models (BERT, GPT-1/2/3), multimodal models (CLIP, DALL·E) and code models (Codex/Copilot). Underneath it all, GPUs/TPUs and open frameworks (TensorFlow, PyTorch, Hugging Face) made each step possible. Demonstrated capability was nearly always narrower than the headlines: benchmark "human parity", game wins under restricted rules, and staged demos.

### Cited Findings (entries, chronological)

#### 2012

**1. `google-cat-paper` — "Building High-Level Features Using Large Scale Unsupervised Learning" (Google "cat" paper)**
- 2012-06 (ICML 2012; arXiv v1 Dec 2011; Google blog June 26, 2012) | Paper | era 4 | Vision | Neural Networks & Deep Learning; Compute & Hardware | Algorithms & Research
- creators: Quoc V. Le, Marc'Aurelio Ranzato, Rajat Monga, Matthieu Devin, Kai Chen, Greg Corrado, Jeff Dean, Andrew Ng (Google Brain / Stanford)
- description: A 1-billion-connection network trained on 16,000 CPU cores with 10 million unlabeled YouTube frames. It developed neurons that responded selectively to cats and human faces.
- capability_note: Showed that large-scale unsupervised learning could discover high-level concepts. Its ImageNet-22k accuracy (~15.8%) was a large relative gain but low in absolute terms. The press called it "Google's brain learned to find cats", which overstated it. It became the founding result of Google Brain.
- edges: created-by → google-brain (org, not a separate entry); inspired-by → none in this file
- source_url: https://arxiv.org/abs/1112.6209
- hero: no

**2. `alexnet` — AlexNet: ImageNet Classification with Deep Convolutional Neural Networks**
- 2012-09-30 (ILSVRC-2012 results); paper at NeurIPS, Dec 2012 | Paper | era 4 | Vision | Neural Networks & Deep Learning; Compute & Hardware | Algorithms & Research
- creators: Alex Krizhevsky, Ilya Sutskever, Geoffrey Hinton (University of Toronto)
- description: An 8-layer CNN trained on two NVIDIA GTX 580 GPUs, using ReLU and dropout. It won ILSVRC-2012 with 15.3% top-5 error; the runner-up had 26.2%.
- capability_note: Showed GPUs plus big labeled data plus deep CNNs beat hand-engineered vision features by a wide margin. Commonly treated as the start of the deep learning boom.
- edges: uses → nvidia-cuda-gpus (context); inspired-by → lenet (pre-2012, see file 01)
- source_url: https://papers.nips.cc/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html
- hero: yes

#### 2013

**3. `word2vec` — word2vec (Efficient Estimation of Word Representations in Vector Space)**
- 2013-01-16 (arXiv); follow-up NeurIPS 2013 paper and open-sourced C code, 2013 | Paper / Open-source repo | era 5 | Language/NLP | Classical ML; Neural Networks & Deep Learning | Algorithms & Research
- creators: Tomas Mikolov, Kai Chen, Greg Corrado, Jeff Dean (Google)
- description: Shallow neural models (CBOW, skip-gram) that learn dense word vectors from billions of words cheaply.
- capability_note: Word vectors captured analogies (king − man + woman ≈ queen) and became a default NLP input layer until contextual embeddings (ELMo/BERT) replaced them. Later work showed they also encoded social biases.
- edges: successor-of → neural-language-models (Bengio 2003, file 01); inspired-by-for → elmo
- source_url: https://arxiv.org/abs/1301.3781 (also https://arxiv.org/abs/1310.4546)
- hero: no

**4. `adversarial-examples` — "Intriguing properties of neural networks" (adversarial examples)**
- 2013-12-21 (arXiv) | Paper | era 4 | Safety & Alignment | Vision; Neural Networks & Deep Learning | Ops/Eval/Safety
- creators: Christian Szegedy, Wojciech Zaremba, Ilya Sutskever, Joan Bruna, Dumitru Erhan, Ian Goodfellow, Rob Fergus
- description: Showed that imperceptible pixel perturbations can make state-of-the-art image classifiers misclassify with high confidence. Goodfellow et al.'s FGSM followed in Dec 2014.
- capability_note: The first strong reality check on "superhuman" vision. High benchmark accuracy did not mean human-like robustness.
- edges: built-on → alexnet
- source_url: https://arxiv.org/abs/1312.6199 (FGSM: https://arxiv.org/abs/1412.6572)
- hero: no

**5. `dqn-atari` — Deep Q-Network (DQN) plays Atari**
- 2013-12-19 (arXiv, NIPS Deep Learning Workshop, 7 games); 2015-02-26 (Nature, 49 games) | Paper | era 3 | RL & Games | Neural Networks & Deep Learning | Algorithms & Research
- creators: Volodymyr Mnih, Koray Kavukcuoglu, David Silver et al. (DeepMind)
- description: A CNN plus Q-learning with experience replay that learned Atari 2600 games directly from pixels and score.
- capability_note: One architecture and one set of hyperparameters reached human-level on many games. The Nature paper reports >75% of a professional tester's score on 29 of 49 games. It still failed badly on sparse-reward games such as Montezuma's Revenge, and needed tens of millions of frames per game.
- edges: created-by → deepmind; uses → alexnet-style CNN
- source_url: https://arxiv.org/abs/1312.5602 ; https://www.nature.com/articles/nature14236
- hero: yes

**6. `caffe` — Caffe deep learning framework**
- 2013-12 (open-sourced by BVLC); paper 2014-06 | Open-source repo | era 4 | Neural Networks & Deep Learning | Vision | Frameworks & SDKs
- creators: Yangqing Jia et al. (Berkeley Vision and Learning Center)
- description: A C++/CUDA framework with a "model zoo" of pretrained CNNs. It was widely used in vision research from 2014 to 2016.
- capability_note: Made it practical to reproduce and fine-tune ImageNet CNNs. TensorFlow and PyTorch later displaced it.
- edges: competes-with → tensorflow; successor → pytorch (Caffe2 merged into PyTorch in 2018)
- source_url: https://arxiv.org/abs/1408.5093
- hero: no

#### 2014

**7. `deepmind-acquired-by-google` — Google acquires DeepMind**
- 2014-01-26 | Event | era 3 | RL & Games | Neural Networks & Deep Learning | Algorithms & Research
- creators: DeepMind (Demis Hassabis, Shane Legg, Mustafa Suleyman); Google
- description: Google bought London-based DeepMind. Price reported at roughly $400–650M (figures vary by outlet; verify).
- capability_note: Showed Big Tech was acquiring deep learning talent, and set up the DQN/AlphaGo/AlphaFold lineage.
- edges: acquired-by → google
- source_url: https://techcrunch.com/2014/01/26/google-deepmind/ (verify)
- hero: no

**8. `gans` — Generative Adversarial Networks**
- 2014-06-10 (arXiv; NeurIPS 2014) | Paper | era 4 | Generative Media | Neural Networks & Deep Learning | Algorithms & Research
- creators: Ian Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio (Université de Montréal)
- description: A generator and a discriminator trained against each other, so the generator learns to produce realistic samples.
- capability_note: The 2014 samples were blurry, low-resolution MNIST, faces and CIFAR images. Photorealistic faces took until StyleGAN (2018–19). GANs were known to be unstable to train, and diffusion models largely replaced them after 2021.
- edges: successor → stylegan; competes-with → ddpm
- source_url: https://arxiv.org/abs/1406.2661
- hero: yes

**9. `bahdanau-attention` — Neural Machine Translation by Jointly Learning to Align and Translate (attention)**
- 2014-09-01 (arXiv; ICLR 2015) | Paper | era 5 | Language/NLP | Neural Networks & Deep Learning | Algorithms & Research
- creators: Dzmitry Bahdanau, Kyunghyun Cho, Yoshua Bengio
- description: Added a learned soft-alignment ("attention") over encoder states to RNN encoder-decoders.
- capability_note: Removed the fixed-length bottleneck, so translation of long sentences no longer degraded as badly. This is the direct ancestor of the Transformer.
- edges: built-on → seq2seq (and Cho et al. 2014 encoder-decoder/GRU, arXiv 1406.1078); inspired → transformer
- source_url: https://arxiv.org/abs/1409.0473
- hero: no

**10. `seq2seq` — Sequence to Sequence Learning with Neural Networks**
- 2014-09-10 (arXiv; NeurIPS 2014) | Paper | era 5 | Language/NLP | Neural Networks & Deep Learning | Algorithms & Research
- creators: Ilya Sutskever, Oriol Vinyals, Quoc V. Le (Google)
- description: Deep LSTM encoder-decoder that maps an input sequence to an output sequence. Reached 34.8 BLEU on WMT'14 En→Fr.
- capability_note: Showed end-to-end neural translation could compete with phrase-based statistical MT. Became the template for GNMT, summarization and chatbots.
- edges: successor → gnmt; competes-with → bahdanau-attention (parallel work)
- source_url: https://arxiv.org/abs/1409.3215
- hero: no

**11. `vgg` — VGGNet (Very Deep Convolutional Networks)**
- 2014-09-04 (arXiv; ILSVRC-2014 runner-up in classification, winner in localization) | Paper | era 4 | Vision | Neural Networks & Deep Learning | Models
- creators: Karen Simonyan, Andrew Zisserman (Oxford Visual Geometry Group)
- description: 16–19-layer CNNs built from uniform stacks of 3×3 convolutions.
- capability_note: Simple and transferable. VGG features became standard backbones for detection and style transfer.
- edges: successor-of → alexnet; competes-with → inception-googlenet
- source_url: https://arxiv.org/abs/1409.1556
- hero: no

**12. `inception-googlenet` — GoogLeNet / Inception (Going Deeper with Convolutions)**
- 2014-09-17 (arXiv; ILSVRC-2014 classification winner, 6.67% top-5) | Paper | era 4 | Vision | Neural Networks & Deep Learning | Models
- creators: Christian Szegedy et al. (Google)
- description: A 22-layer network of "Inception" modules with parallel filter sizes, using about 12× fewer parameters than AlexNet.
- capability_note: Showed that architectural efficiency, not just size, improves accuracy.
- edges: successor-of → alexnet; competes-with → vgg
- source_url: https://arxiv.org/abs/1409.4842
- hero: no

**13. `cudnn` — NVIDIA cuDNN**
- 2014-09 (release); paper 2014-10-03 | Open-source repo (proprietary library; categorize as Major update if preferred) | era 3 | Compute & Hardware | Neural Networks & Deep Learning | Inference & Runtime
- creators: Sharan Chetlur et al. (NVIDIA)
- description: A GPU library of optimized deep learning primitives (convolutions, etc.) that Caffe, Theano, Torch, TensorFlow and PyTorch all built on.
- capability_note: Locked NVIDIA in as the default deep learning hardware and software layer.
- edges: used-by → caffe, tensorflow, pytorch
- source_url: https://arxiv.org/abs/1410.0759
- hero: no

**14. `adam-optimizer` — Adam: A Method for Stochastic Optimization**
- 2014-12-22 (arXiv; ICLR 2015) | Paper | era 3 | Neural Networks & Deep Learning | Classical ML | Algorithms & Research
- creators: Diederik P. Kingma, Jimmy Ba
- description: An adaptive-learning-rate optimizer that combines momentum with RMSProp-style per-parameter scaling.
- capability_note: Became the default optimizer for most deep learning, including Transformers (with the AdamW variant). It is one of the most-cited ML papers.
- edges: used-by → transformer, bert, gpt-3
- source_url: https://arxiv.org/abs/1412.6980
- hero: no

#### 2015

**15. `batch-normalization` — Batch Normalization**
- 2015-02-11 (arXiv) | Paper | era 3 | Neural Networks & Deep Learning | Vision | Algorithms & Research
- creators: Sergey Ioffe, Christian Szegedy (Google)
- description: Normalizes layer activations per mini-batch, which enables higher learning rates and faster training.
- capability_note: Its "internal covariate shift" explanation was later disputed, but it was used everywhere. It made very deep nets such as ResNet trainable.
- edges: used-by → resnet
- source_url: https://arxiv.org/abs/1502.03167
- hero: no

**16. `prelu-surpassing-human-imagenet` — "Surpassing Human-Level Performance on ImageNet" (Microsoft PReLU-nets)**
- 2015-02-06 (arXiv) | Paper | era 4 | Vision | Neural Networks & Deep Learning | Algorithms & Research
- creators: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun (Microsoft Research)
- description: Reported 4.94% top-5 error, below the ~5.1% "human" error that one annotator (Andrej Karpathy) estimated.
- capability_note: CLAIM vs REALITY case. "Surpasses humans" referred to a single-annotator estimate on a 1000-class benchmark full of fine-grained dog breeds. It did not mean general visual understanding, and adversarial examples (entry 4) showed brittleness.
- edges: built-on → alexnet; successor → resnet
- source_url: https://arxiv.org/abs/1502.01852
- hero: no

**17. `keras` — Keras**
- 2015-03-27 (initial release) | Open-source repo | era 3 | Neural Networks & Deep Learning | — | Frameworks & SDKs
- creators: François Chollet
- description: A high-level Python API for neural nets, originally on Theano. It became TensorFlow's official high-level API (tf.keras; default in TF 2.0, Sept 2019).
- capability_note: Brought deep learning within reach of non-specialists and students. A few lines of code could define and train a CNN.
- edges: built-on → tensorflow (later); competes-with → pytorch
- source_url: https://github.com/keras-team/keras
- hero: no

**18. `ibm-watson-health` — IBM Watson Health (Watson for Oncology)**
- 2015-04-13 (Watson Health unit launched); MD Anderson oncology partnership announced 2013-10; data and analytics assets sold 2022-01-21 | Product | era 3 | Classical ML | Language/NLP | Apps & Products
- creators: IBM; partners Memorial Sloan Kettering (training) and MD Anderson
- description: IBM marketed its Jeopardy-winning Watson brand as an AI system to recommend cancer treatments and change healthcare.
- capability_note: HYPE/FLOP case. A 2017 STAT investigation found that only a few dozen hospitals had adopted it, that it struggled to learn about cancer types, and that its advice was biased toward US practice ([STAT 2017](https://www.statnews.com/2017/09/05/watson-ibm-cancer/)). Internal IBM documents reported by STAT in 2018 showed "unsafe and incorrect" treatment recommendations, traced to training on a small number of synthetic cases ([STAT 2018](https://www.statnews.com/2018/07/25/ibm-watson-recommended-unsafe-incorrect-treatments/)). The MD Anderson project was benched in 2017 ([Forbes](https://www.forbes.com/sites/matthewherper/2017/02/19/md-anderson-benches-ibm-watson-in-setback-for-artificial-intelligence-in-medicine/)). IBM sold the data/analytics assets to Francisco Partners in January 2022, where they became Merative ([IBM newsroom](https://newsroom.ibm.com/2022-01-21-Francisco-Partners-to-Acquire-IBMs-Healthcare-Data-and-Analytics-Assets)). See also [IEEE Spectrum, "How IBM Watson Overpromised and Underdelivered"](https://spectrum.ieee.org/how-ibm-watson-overpromised-and-underdelivered-on-ai-health-care).
- edges: none (IBM Watson 2011 Jeopardy is in the earlier file)
- source_url: https://www.statnews.com/2017/09/05/watson-ibm-cancer/
- hero: yes (as a flop)

**19. `u-net` — U-Net**
- 2015-05-18 (arXiv; MICCAI 2015) | Paper | era 4 | Vision | Neural Networks & Deep Learning | Models
- creators: Olaf Ronneberger, Philipp Fischer, Thomas Brox (University of Freiburg)
- description: An encoder-decoder CNN with skip connections for biomedical image segmentation from few training images.
- capability_note: Became the standard medical segmentation architecture, and later the denoising backbone of DDPM and latent diffusion.
- edges: used-by → ddpm, latent-diffusion
- source_url: https://arxiv.org/abs/1505.04597
- hero: no

**20. `yolo` — YOLO: You Only Look Once**
- 2015-06-08 (arXiv; CVPR 2016) | Paper / Open-source repo | era 4 | Vision | Robotics & Embodied | Models
- creators: Joseph Redmon, Santosh Divvala, Ross Girshick, Ali Farhadi
- description: Single-pass real-time object detector, released open source (Darknet).
- capability_note: Made real-time detection accessible on commodity GPUs. In 2020 Redmon quit computer vision research, citing military and privacy uses.
- edges: competes-with → faster-r-cnn (not a separate entry)
- source_url: https://arxiv.org/abs/1506.02640
- hero: no

**21. `tensorflow` — TensorFlow**
- 2015-11-09 (open-sourced, Apache 2.0) | Open-source repo | era 3 | Neural Networks & Deep Learning | Compute & Hardware | Frameworks & SDKs
- creators: Google Brain (Jeff Dean, Rajat Monga et al.); successor to the internal DistBelief system
- description: A dataflow-graph ML framework that scaled from phones to datacenters and later to TPUs.
- capability_note: Established the open-source deep learning framework as a standard layer and dominated industry through about 2018. PyTorch later overtook it in research.
- edges: created-by → google-brain; competes-with → pytorch; uses → cudnn
- source_url: https://github.com/tensorflow/tensorflow (whitepaper: https://arxiv.org/abs/1603.04467)
- hero: no

**22. `resnet` — ResNet: Deep Residual Learning**
- 2015-12-10 (arXiv); won ILSVRC/COCO 2015; CVPR 2016 best paper | Paper | era 4 | Vision | Neural Networks & Deep Learning | Models
- creators: Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun (Microsoft Research)
- description: Residual (skip) connections made networks of 152+ layers trainable. Reached 3.57% top-5 on ImageNet.
- capability_note: The residual connection became a universal building block, including in every Transformer.
- edges: successor-of → vgg; used-by → transformer, alphago-zero
- source_url: https://arxiv.org/abs/1512.03385
- hero: no

**23. `openai-founded` — OpenAI founded**
- 2015-12-11 | Organization | era 3 | Foundation Models | Safety & Alignment; RL & Games | Algorithms & Research
- creators: Sam Altman, Elon Musk, Greg Brockman, Ilya Sutskever, Wojciech Zaremba, John Schulman and others
- description: Launched as a non-profit research lab. Backers pledged $1B.
- capability_note: Changed who builds frontier AI. It restructured into a capped-profit company in 2019 (entry 58).
- edges: successor → openai-lp-microsoft
- source_url: https://openai.com/index/introducing-openai/
- hero: no

**24. `deep-speech-2` — Deep Speech 2 (Baidu)**
- 2015-12-08 (arXiv) | Paper | era 4 | Speech & Audio | Neural Networks & Deep Learning | Models
- creators: Dario Amodei et al. (Baidu Silicon Valley AI Lab)
- description: End-to-end deep speech recognition for English and Mandarin, trained with HPC-style GPU scaling.
- capability_note: Showed end-to-end ASR competitive with traditional pipelines. Its lead author later co-founded Anthropic.
- edges: competes-with → microsoft-speech-parity
- source_url: https://arxiv.org/abs/1512.02595
- hero: no

#### 2016

**25. `alphago` — AlphaGo**
- 2016-01-27 (Nature paper; had beaten European champion Fan Hui 5–0 in Oct 2015) | Model | era 3 | RL & Games | Neural Networks & Deep Learning | Models
- creators: David Silver, Aja Huang, Demis Hassabis et al. (DeepMind)
- description: Policy and value networks, trained on human games plus self-play RL and combined with Monte Carlo tree search.
- capability_note: The first program to beat a professional Go player on a full board without handicap. It relied on large TPU/GPU compute and was specific to Go.
- edges: created-by → deepmind; successor → alphago-zero; built-on → dqn-atari (deep RL lineage)
- source_url: https://www.nature.com/articles/nature16961
- hero: yes

**26. `alphago-lee-sedol-move-37` — AlphaGo vs Lee Sedol (Move 37)**
- 2016-03-09 to 2016-03-15 (Seoul); Move 37 in Game 2 on 2016-03-10 | Event | era 3 | RL & Games | — | Apps & Products
- creators: DeepMind; Lee Sedol
- description: AlphaGo won 4–1. Its Move 37 in Game 2 was a shoulder-hit that commentators first judged a mistake and then called creative. Lee's Move 78 in Game 4 produced AlphaGo's only loss.
- capability_note: The public "AI creativity" moment. The Game 4 loss showed AlphaGo could still be derailed by an unexpected move.
- edges: uses → alphago
- source_url: https://www.wired.com/2016/03/two-moves-alphago-lee-sedol-redefined-future/
- hero: yes

**27. `tay-chatbot` — Microsoft Tay**
- 2016-03-23 (launched on Twitter; pulled within about a day) | Product | era 5 | Language/NLP | Safety & Alignment | Apps & Products
- creators: Microsoft Research / Bing
- description: A Twitter chatbot that learned from user interactions. Coordinated users got it to post racist and offensive tweets within 24 hours.
- capability_note: FLOP case. Microsoft said a "coordinated attack" exploited a vulnerability, and that it had made "a critical oversight for this specific attack." Its sibling bot XiaoIce was then serving about 40 million people in China.
- edges: none
- source_url: https://blogs.microsoft.com/blog/2016/03/25/learning-tays-introduction/
- hero: no

**28. `sophia-robot` — Sophia (Hanson Robotics)**
- 2016 (first activated; commonly given as Feb 2016); granted Saudi "citizenship" 2017-10-25 | Product | era 5 | Robotics & Embodied | Language/NLP | Apps & Products
- creators: Hanson Robotics (David Hanson)
- description: A humanoid animatronic head and body, widely presented at conferences and on TV as a conversational AI.
- capability_note: HYPE case. It relied on scripted and operator-assisted dialogue. Yann LeCun called it "Potemkin AI" and a "puppet" (see Q2). Commentators described it as more marketing than AI.
- edges: none
- source_url: https://www.skynettoday.com/briefs/sophia
- hero: no

**29. `tpu-v1` — Google Tensor Processing Unit (v1)**
- 2016-05-18 (announced at Google I/O; in datacenters since 2015); ISCA paper 2017 | Model (hardware) — suggest type Product | era 3 | Compute & Hardware | — | Compute & Hardware
- creators: Norman Jouppi et al. (Google)
- description: An 8-bit inference ASIC with a 256×256 systolic matrix unit.
- capability_note: The paper reported 15–30× faster inference and 30–80× better perf/watt than the CPUs/GPUs of the day. It powered AlphaGo and Google Translate, and started the custom AI accelerator era.
- edges: used-by → alphago, gnmt; competes-with → nvidia-v100
- source_url: https://arxiv.org/abs/1704.04760
- hero: no

**30. `wavenet` — WaveNet**
- 2016-09-08 (arXiv / DeepMind blog) | Model | era 4 | Speech & Audio | Generative Media | Models
- creators: Aäron van den Oord, Sander Dieleman et al. (DeepMind)
- description: An autoregressive dilated-convolution model that generated raw audio waveforms one sample at a time.
- capability_note: Its speech was rated far more natural than prior TTS, but the original was far too slow for production. Parallel WaveNet (Nov 2017) made deployment in Google Assistant possible.
- edges: created-by → deepmind; inspired → google-duplex (TTS component)
- source_url: https://arxiv.org/abs/1609.03499
- hero: no

**31. `gnmt` — Google Neural Machine Translation (GNMT)**
- 2016-09-26 (arXiv); production launch for Chinese→English on 2016-09-27 | Model / Major update | era 5 | Language/NLP | Compute & Hardware | Apps & Products
- creators: Yonghui Wu, Mike Schuster, Quoc Le et al. (Google Brain / Translate)
- description: An 8-layer LSTM seq2seq model with attention that replaced phrase-based SMT in Google Translate.
- capability_note: Google reported large error reductions in human side-by-side ratings. The press covered it as an "AI awakening" (NYT Magazine, Dec 2016). Translation still failed on rare words, long documents and idioms.
- edges: built-on → seq2seq, bahdanau-attention; uses → tpu-v1; successor → transformer
- source_url: https://arxiv.org/abs/1609.08144 ; context: https://www.nytimes.com/2016/12/14/magazine/the-great-ai-awakening.html
- hero: no

**32. `microsoft-speech-parity` — Microsoft "human parity" in conversational speech recognition**
- 2016-10-17 (arXiv) | Paper | era 4 | Speech & Audio | Neural Networks & Deep Learning | Algorithms & Research
- creators: Wayne Xiong, Xuedong Huang et al. (Microsoft Research)
- description: Reported a 5.9% word error rate on the Switchboard benchmark, matching professional transcribers on that test.
- capability_note: CLAIM vs REALITY case. "Parity" held on one telephone benchmark. Real-world accents, noise and far-field audio stayed much harder.
- edges: competes-with → deep-speech-2
- source_url: https://arxiv.org/abs/1610.05256
- hero: no

**33. `pytorch` — PyTorch**
- 2016-09 (initial GitHub development); public release 2017-01 | Open-source repo | era 3 | Neural Networks & Deep Learning | — | Frameworks & SDKs
- creators: Adam Paszke, Sam Gross, Soumith Chintala, Gregory Chanan et al. (Facebook AI Research)
- description: A Python-first, eager-execution ("define-by-run") framework descended from Lua Torch.
- capability_note: Became the dominant research framework by about 2019–2020. Hugging Face, GPT-Neo and Stable Diffusion were all built on it.
- edges: competes-with → tensorflow, jax; uses → cudnn
- source_url: https://github.com/pytorch/pytorch (paper: https://arxiv.org/abs/1912.01703)
- hero: no
- NOTE: the brief says "PyTorch 2016". The widely cited public release is January 2017; the first code dates to 2016.

#### 2015–2021 (span entry)

**34. `self-driving-hype` — Self-driving car timelines (Tesla, Ford and others)**
- 2015-12 to 2021 (span) | Event | era 4 | Robotics & Embodied | Vision | Apps & Products
- creators: Tesla (Elon Musk), Ford, Uber ATG, Waymo, GM Cruise and others
- description: Industry leaders repeatedly promised full autonomy or robotaxi fleets within one to five years.
- capability_note: HYPE case. Musk predicted complete autonomy "in approximately two years" (Dec 2015), a coast-to-coast autonomous drive by end-2017, and "over a million robotaxis" by 2020. None happened ([Wikipedia list with original sources](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk); [The Drive](https://www.thedrive.com/news/38129/elon-musk-promised-1-million-tesla-robotaxis-by-the-end-of-2020-where-are-they)). In 2016 Ford said it would have a Level-4 vehicle "in commercial operation in 2021" for ride-hailing ([CNBC](https://www.cnbc.com/2016/08/16/ford-will-have-a-fully-autonomous-vehicle-on-the-streets-in-less-than-five-years.html)), and it did not happen. Full quotes are in Q2.
- edges: related → uber-atg-fatal-crash
- source_url: https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk
- hero: yes (as a hype case)

#### 2017

**35. `alphago-zero` — AlphaGo Zero**
- 2017-10-18 (Nature) | Model | era 3 | RL & Games | Neural Networks & Deep Learning | Models
- creators: David Silver, Julian Schrittwieser et al. (DeepMind)
- description: Learned Go purely from self-play, with no human games, and beat the Lee Sedol version of AlphaGo 100–0.
- capability_note: Showed human data was not needed in a perfectly simulable, rules-known domain. The result does not carry over to messy real-world domains.
- edges: successor-of → alphago; successor → alphazero; uses → resnet
- source_url: https://www.nature.com/articles/nature24270
- hero: no

**36. `rlhf-christiano` — Deep Reinforcement Learning from Human Preferences (RLHF)**
- 2017-06-12 (arXiv; NeurIPS 2017) | Paper | era 3 | Safety & Alignment | RL & Games | Ops/Eval/Safety
- creators: Paul Christiano, Jan Leike, Tom Brown, Miljan Martic, Shane Legg, Dario Amodei (OpenAI + DeepMind)
- description: Trained a reward model from human pairwise comparisons of agent behaviour, then optimized agents against it. For example, a simulated robot learned a backflip.
- capability_note: Little noticed at the time. It is the root of InstructGPT/ChatGPT-style alignment (2022, outside scope), and was later applied to summarization (2020).
- edges: uses → ppo (in later work); inspired → instructgpt (post-2021)
- source_url: https://arxiv.org/abs/1706.03741 (blog: https://openai.com/index/learning-from-human-preferences/)
- hero: no

**37. `transformer` — Transformer: "Attention Is All You Need"**
- 2017-06-12 (arXiv; NeurIPS 2017) | Paper | era 5 | Language/NLP | Neural Networks & Deep Learning; Foundation Models | Algorithms & Research
- creators: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin (Google Brain / Google Research)
- description: A sequence model built entirely on self-attention, with no recurrence. It set a WMT'14 En→De record of 28.4 BLEU at lower training cost.
- capability_note: Parallelizable training on accelerators made scaling practical. It became the architecture of BERT, GPT, T5, ViT, AlphaFold 2's attention modules, CLIP and DALL·E. In 2017 it was presented as a translation improvement.
- edges: built-on → bahdanau-attention, resnet (residuals), adam-optimizer; successor-of → gnmt
- source_url: https://arxiv.org/abs/1706.03762
- hero: yes

**38. `ppo` — Proximal Policy Optimization**
- 2017-07-20 (arXiv) | Paper | era 3 | RL & Games | — | Algorithms & Research
- creators: John Schulman, Filip Wolski, Prafulla Dhariwal, Alec Radford, Oleg Klimov (OpenAI)
- description: A simple, stable policy-gradient method with a clipped objective.
- capability_note: Became the default RL algorithm. It was used in OpenAI Five, Dactyl and RLHF fine-tuning of language models.
- edges: used-by → openai-five, dactyl-rubiks-cube
- source_url: https://arxiv.org/abs/1707.06347
- hero: no

**39. `nvidia-v100` — NVIDIA Tesla V100 (Volta)**
- 2017-05-10 (announced at GTC) | Product | era 3 | Compute & Hardware | — | Compute & Hardware
- creators: NVIDIA
- description: The first NVIDIA datacenter GPU with Tensor Cores for mixed-precision matrix math.
- capability_note: The workhorse for training BERT, GPT-2 and GPT-3. GPT-3 was trained on a V100 cluster on Microsoft Azure.
- edges: competes-with → tpu-v1; successor → nvidia-a100
- source_url: https://www.nvidia.com/en-us/data-center/v100/
- hero: no

**40. `onnx` — ONNX (Open Neural Network Exchange)**
- 2017-09-07 (announced by Microsoft and Facebook) | Open-source repo | era 3 | Protocols & Standards | — | Protocols
- creators: Microsoft, Facebook (later Linux Foundation AI)
- description: An open interchange format for trained models across frameworks and runtimes.
- capability_note: Defined a standard for model portability between training frameworks and inference runtimes.
- edges: competes-with / bridges → tensorflow, pytorch
- source_url: https://github.com/onnx/onnx
- hero: no

**41. `google-colab` — Google Colaboratory**
- 2017-10 (public release, approx.; verify exact date) | Product | era 3 | Neural Networks & Deep Learning | — | Apps & Products
- creators: Google
- description: A hosted Jupyter notebook service with free GPU (and later TPU) access.
- capability_note: Changed who could build AI. Students and hobbyists could train models without owning a GPU. EleutherAI-era and later community projects shipped Colab notebooks.
- edges: uses → tensorflow, pytorch
- source_url: https://colab.research.google.com/ (verify launch date)
- hero: no

**42. `deepfakes` — "Deepfakes" (face-swap videos)**
- 2017-11 to 2017-12 (Reddit user "deepfakes"; Motherboard report Dec 11, 2017) | Event | era 4 | Generative Media | Safety & Alignment | Apps & Products
- creators: Anonymous Reddit user; open-source tools later (FakeApp, DeepFaceLab)
- description: Autoencoder-based face swapping used to put celebrities' faces into pornographic videos without consent.
- capability_note: The first mass-market generative-media harm. It triggered platform bans and legislation debates. Quality was crude by later standards.
- edges: built-on → gans / autoencoders
- source_url: https://www.vice.com/en/article/gydydm/gal-gadot-fake-ai-porn (verify URL)
- hero: no

**43. `alphazero` — AlphaZero**
- 2017-12-05 (arXiv); Science paper 2018-12-07 | Model | era 3 | RL & Games | — | Models
- creators: David Silver et al. (DeepMind)
- description: A single self-play algorithm that mastered chess, shogi and Go from rules alone, beating Stockfish, Elmo and AlphaGo Zero.
- capability_note: The chess result was disputed because Stockfish 8 ran under restricted conditions in the 2017 preprint. The 2018 Science paper addressed this with more matches. It needed thousands of TPUs for self-play.
- edges: successor-of → alphago-zero; successor → muzero
- source_url: https://arxiv.org/abs/1712.01815
- hero: no

#### 2018

**44. `ulmfit` — ULMFiT (Universal Language Model Fine-tuning)**
- 2018-01-18 (arXiv; ACL 2018) | Paper | era 5 | Language/NLP | Foundation Models | Algorithms & Research
- creators: Jeremy Howard (fast.ai), Sebastian Ruder
- description: Pretrain an LSTM language model, then fine-tune it for classification with discriminative learning rates.
- capability_note: Showed that transfer learning, "ImageNet for NLP", worked with very few labeled examples. It was released open source in fastai.
- edges: inspired → gpt-1, bert
- source_url: https://arxiv.org/abs/1801.06146
- hero: no

**45. `elmo` — ELMo (Deep Contextualized Word Representations)**
- 2018-02-15 (arXiv; NAACL 2018 best paper) | Paper | era 5 | Language/NLP | Foundation Models | Models
- creators: Matthew Peters et al. (Allen Institute for AI / UW)
- description: Contextual word embeddings from a bidirectional LSTM language model.
- capability_note: Improved the state of the art across six NLP tasks. BERT superseded it within about 8 months.
- edges: successor-of → word2vec; successor → bert
- source_url: https://arxiv.org/abs/1802.05365
- hero: no

**46. `gender-shades` — Gender Shades**
- 2018-02 (FAT* 2018 / PMLR vol. 81) | Paper | era 4 | Safety & Alignment | Vision | Ops/Eval/Safety
- creators: Joy Buolamwini, Timnit Gebru
- description: An audit of commercial gender classifiers from IBM, Microsoft and Face++ across skin tone and gender.
- capability_note: Error rates reached up to ~34.7% for darker-skinned women versus ≤0.8% for lighter-skinned men. It showed that aggregate accuracy hid disparate failures, and vendors changed their systems in response.
- edges: related → adversarial-examples (robustness/eval)
- source_url: https://proceedings.mlr.press/v81/buolamwini18a.html
- hero: no

**47. `uber-atg-fatal-crash` — Uber ATG self-driving test car kills pedestrian (Tempe, AZ)**
- 2018-03-18 | Event | era 4 | Robotics & Embodied | Safety & Alignment | Apps & Products
- creators: Uber Advanced Technologies Group
- description: The first pedestrian death involving a self-driving test vehicle, Elaine Herzberg. The NTSB found the system detected her but failed to classify her correctly or predict her path, and automatic emergency braking was disabled.
- capability_note: REALITY check on self-driving timelines. Uber sold ATG to Aurora in Dec 2020.
- edges: related → self-driving-hype
- source_url: https://www.ntsb.gov/investigations/Pages/HWY18MH010.aspx (verify)
- hero: no

**48. `glue-benchmark` — GLUE benchmark**
- 2018-04-20 (arXiv) | Paper | era 5 | LLMOps & Eval | Language/NLP | Ops/Eval/Safety
- creators: Alex Wang, Amanpreet Singh, Julian Michael, Felix Hill, Omer Levy, Samuel Bowman (NYU/UW/DeepMind)
- description: A multi-task benchmark with public leaderboard for natural language understanding.
- capability_note: Models passed the "human baseline" within about a year, which prompted SuperGLUE (2019). It is an early example of benchmark saturation outrunning real understanding.
- edges: used-by → bert, gpt-1
- source_url: https://arxiv.org/abs/1804.07461
- hero: no

**49. `google-duplex` — Google Duplex**
- 2018-05-08 (Google I/O demo) | Product | era 5 | Speech & Audio | Language/NLP; Personal Agents | Apps & Products
- creators: Google (Yaniv Leviathan, Yossi Matias)
- description: An AI phone agent that booked restaurant and salon appointments with human-sounding speech ("um", "mm-hmm").
- capability_note: HYPE case. The demo triggered ethics concerns about not disclosing that callers were talking to an AI. In May 2019 Google told the NYT that about 25% of calls started with a human in a call center and about 15% needed human intervention. In NYT tests, humans completed three of four successful bookings ([Engadget summary](https://www.engadget.com/2019-05-22-google-duplex-is-made-of-people.html); [Android Police](https://www.androidpolice.com/2019/05/23/25-percent-of-google-duplex-calls-are-actually-conducted-by-humans/)).
- edges: uses → wavenet
- source_url: https://ai.googleblog.com/2018/05/duplex-ai-system-for-natural-conversation.html
- hero: yes (as a hype case)

**50. `gpt-1` — GPT-1 (Improving Language Understanding by Generative Pre-Training)**
- 2018-06-11 | Model / Paper | era 5 | Foundation Models | Language/NLP | Models
- creators: Alec Radford, Karthik Narasimhan, Tim Salimans, Ilya Sutskever (OpenAI)
- description: A 117M-parameter Transformer decoder pretrained on BooksCorpus, then fine-tuned for each task.
- capability_note: Established generative pretraining plus fine-tuning. It improved the state of the art on 9 of 12 tasks studied.
- edges: built-on → transformer; inspired-by → ulmfit; successor → gpt-2; competes-with → bert
- source_url: https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf
- hero: no

**51. `openai-five` — OpenAI Five (Dota 2)**
- 2018-06 (announced); lost to pros at TI8 in Aug 2018; beat world champions OG 2–0 on 2019-04-13 | Model | era 3 | RL & Games | — | Models
- creators: OpenAI
- description: Five LSTM agents trained with PPO on massive self-play, roughly 45,000 years of gameplay according to OpenAI.
- capability_note: Superhuman team play in a complex game, but in a restricted setting: a limited hero pool (17 heroes in the 2019 matches) and some game-mechanics restrictions. Players later found exploits during the public "Arena".
- edges: uses → ppo; competes-with → alphastar
- source_url: https://openai.com/index/openai-five-defeats-dota-2-world-champions/ (paper: https://arxiv.org/abs/1912.06680)
- hero: no

**52. `bert` — BERT**
- 2018-10-11 (arXiv; open-sourced Nov 2018) | Model / Paper | era 5 | Foundation Models | Language/NLP | Models
- creators: Jacob Devlin, Ming-Wei Chang, Kenton Lee, Kristina Toutanova (Google AI Language)
- description: A bidirectional Transformer encoder pretrained with masked-language modelling and next-sentence prediction, with released weights.
- capability_note: Set records on 11 NLP tasks (GLUE 80.5, SQuAD). It became the default NLP backbone from 2019 to 2020. Later probing work showed it often exploited dataset artifacts, for example on the ARCT reasoning task.
- edges: built-on → transformer; successor-of → elmo; competes-with → gpt-1; successor → bert-in-google-search
- source_url: https://arxiv.org/abs/1810.04805
- hero: yes

**53. `hf-transformers` — Hugging Face Transformers library**
- 2018-11 (released as pytorch-pretrained-BERT); renamed pytorch-transformers in July 2019 and transformers in Sept 2019 | Open-source repo | era 5 | Foundation Models | Language/NLP | Frameworks & SDKs
- creators: Hugging Face (Thomas Wolf, Lysandre Debut, Victor Sanh, Julien Chaumond et al.)
- description: A unified API and model hub for pretrained Transformers (BERT, GPT-2, T5, …) in PyTorch, TensorFlow and later JAX.
- capability_note: Changed who could use state-of-the-art NLP, since a model loaded in about three lines of code. It became one of the most-starred ML repos and the de facto model distribution layer.
- edges: built-on → pytorch; uses → bert, gpt-2
- source_url: https://github.com/huggingface/transformers (paper: https://arxiv.org/abs/1910.03771)
- hero: no

**54. `jax` — JAX**
- 2018-12 (open-sourced; SysML 2018 paper) | Open-source repo | era 3 | Neural Networks & Deep Learning | Compute & Hardware | Frameworks & SDKs
- creators: Roy Frostig, Matthew Johnson, Chris Leary et al. (Google)
- description: Composable function transformations (grad, jit, vmap, pmap) on NumPy, compiled with XLA.
- capability_note: Became the framework for large TPU-scale research at DeepMind and Google, and underpinned EleutherAI's GPT-J (mesh-transformer-jax).
- edges: competes-with → pytorch, tensorflow; used-by → gpt-j
- source_url: https://github.com/jax-ml/jax
- hero: no

**55. `stylegan` — StyleGAN**
- 2018-12-12 (arXiv); thispersondoesnotexist.com went viral in Feb 2019 | Model / Open-source repo | era 4 | Generative Media | Vision | Models
- creators: Tero Karras, Samuli Laine, Timo Aila (NVIDIA)
- description: A style-based GAN generator producing photorealistic 1024×1024 faces.
- capability_note: The first widely viewed photorealistic synthetic faces. They were soon used for fake social media profiles. It worked well only within narrow domains such as faces, cars and cats.
- edges: successor-of → gans
- source_url: https://arxiv.org/abs/1812.04948
- hero: no

#### 2019

**56. `alphastar` — AlphaStar (StarCraft II)**
- 2019-01-24 (beat pros TLO and MaNa 10–1 in exhibitions); 2019-10-30 (Nature: Grandmaster level on Battle.net) | Model | era 3 | RL & Games | — | Models
- creators: Oriol Vinyals et al. (DeepMind)
- description: Transformer/LSTM agents trained by imitation plus league-based multi-agent RL.
- capability_note: The January matches were criticized for superhuman click bursts and whole-map vision in most games. MaNa won the one live game played under camera restrictions. The Nature version added APM and camera limits and reached Grandmaster for all three races, above 99.8% of ranked players.
- edges: created-by → deepmind; competes-with → openai-five
- source_url: https://www.nature.com/articles/s41586-019-1724-z
- hero: no

**57. `gpt-2` — GPT-2 and the staged release**
- 2019-02-14 (announced; 124M released); 355M in May 2019, 774M in Aug 2019, 1.5B full release on 2019-11-05 | Model | era 5 | Foundation Models | Language/NLP; Safety & Alignment | Models
- creators: Alec Radford, Jeffrey Wu, Rewon Child, David Luan, Dario Amodei, Ilya Sutskever (OpenAI)
- description: A 1.5B-parameter Transformer language model trained on WebText (40GB of Reddit-linked pages). It generated multi-paragraph coherent text.
- capability_note: CLAIM vs REALITY case. OpenAI withheld the full model, citing "concerns about malicious applications of the technology." Coverage framed it as "too dangerous to release." Critics, including fast.ai, called it publicity or argued against withholding. The full model came out nine months later, and OpenAI said it had seen "no strong evidence of misuse" (verify phrase). Zero-shot, it could write fluent paragraphs but lost coherence over longer text.
- edges: successor-of → gpt-1; successor → gpt-3; built-on → transformer
- source_url: https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf ; controversy: https://www.fast.ai/posts/2019-02-15-openai-gp2.html
- hero: yes

**58. `openai-lp-microsoft` — OpenAI LP (capped-profit) and the Microsoft $1B investment**
- 2019-03-11 (OpenAI LP); 2019-07-22 (Microsoft $1B, Azure partnership) | Organization | era 5 | Foundation Models | Compute & Hardware | Compute & Hardware
- creators: OpenAI; Microsoft
- description: OpenAI created a capped-profit entity to raise capital, then took $1B from Microsoft with Azure as its exclusive cloud.
- capability_note: Tied frontier model development to hyperscaler compute. GPT-3 was trained on Azure.
- edges: successor-of → openai-founded
- source_url: https://openai.com/index/openai-lp/ (verify); https://news.microsoft.com/2019/07/22/openai-forms-exclusive-computing-partnership-with-microsoft-to-build-new-azure-ai-supercomputing-technologies/ (verify)
- hero: no

**59. `turing-award-2018` — Turing Award to Hinton, LeCun and Bengio**
- 2019-03-27 (announced as the 2018 ACM A.M. Turing Award) | Person / Event | era 3 | Neural Networks & Deep Learning | — | Algorithms & Research
- creators: Geoffrey Hinton, Yann LeCun, Yoshua Bengio
- description: ACM honored the three "for conceptual and engineering breakthroughs that have made deep neural networks a critical component of computing."
- capability_note: Formal recognition that deep learning had moved from fringe to mainstream computer science.
- edges: related → alexnet (Hinton), gans (Bengio lab), bahdanau-attention (Bengio)
- source_url: https://awards.acm.org/about/2018-turing
- hero: no

**60. `pluribus` — Pluribus (six-player no-limit poker)**
- 2019-07-11 (Science) | Model | era 3 | RL & Games | — | Models
- creators: Noam Brown, Tuomas Sandholm (CMU / Facebook AI)
- description: Beat elite professionals at six-player no-limit Texas hold'em. It followed Libratus (heads-up, Jan 2017).
- capability_note: The first superhuman result in a multiplayer imperfect-information game. It used search and counterfactual regret minimization rather than deep learning, and trained on a relatively small compute budget.
- edges: competes-with → openai-five (imperfect-information game AI)
- source_url: https://www.science.org/doi/10.1126/science.aay2400
- hero: no

**61. `megatron-lm` — Megatron-LM**
- 2019-09-17 (arXiv) | Paper / Open-source repo | era 5 | Foundation Models | Compute & Hardware | Frameworks & SDKs
- creators: Mohammad Shoeybi et al. (NVIDIA)
- description: Intra-layer model parallelism for training Transformers of 8.3B parameters across 512 GPUs.
- capability_note: Provided open tooling for multi-billion-parameter training, later used for Megatron-Turing NLG 530B (Oct 2021).
- edges: built-on → transformer; uses → nvidia-v100
- source_url: https://arxiv.org/abs/1909.08053
- hero: no

**62. `dactyl-rubiks-cube` — OpenAI Dactyl solves a Rubik's Cube one-handed**
- 2019-10-15 | Model | era 4 | Robotics & Embodied | RL & Games | Models
- creators: OpenAI Robotics
- description: A Shadow robot hand, trained in simulation with automatic domain randomization, manipulated a Rubik's Cube.
- capability_note: CLAIM vs REALITY case. The solution sequence came from a classical solver (Kociemba's algorithm), and the neural net did only the manipulation. OpenAI reported about 60% success overall and 20% on maximally difficult scrambles. OpenAI disbanded its robotics team in 2021.
- edges: uses → ppo
- source_url: https://openai.com/index/solving-rubiks-cube/ (paper: https://arxiv.org/abs/1910.07113)
- hero: no

**63. `t5-c4` — T5 and the C4 dataset**
- 2019-10-23 (arXiv) | Paper / Model | era 5 | Foundation Models | Language/NLP | Data
- creators: Colin Raffel, Noam Shazeer, Adam Roberts et al. (Google)
- description: A text-to-text Transformer, up to 11B parameters, trained on C4 (the "Colossal Clean Crawled Corpus", about 750GB of filtered Common Crawl).
- capability_note: Made cleaned Common Crawl a standard pretraining source. Later audits (Dodge et al., 2021) found that C4's blocklist filtering disproportionately removed text about and by minority groups.
- edges: built-on → transformer; related-data → the-pile
- source_url: https://arxiv.org/abs/1910.10683
- hero: no

**64. `bert-in-google-search` — BERT deployed in Google Search**
- 2019-10-25 | Major update | era 5 | Language/NLP | Foundation Models | Apps & Products
- creators: Google (Pandu Nayak)
- description: Google began using BERT to interpret search queries, affecting about 1 in 10 US English queries at launch.
- capability_note: The first mass-scale production deployment of a pretrained Transformer.
- edges: uses → bert
- source_url: https://blog.google/products/search/search-language-understanding-bert/
- hero: no

**65. `muzero` — MuZero**
- 2019-11-19 (arXiv); Nature 2020-12 | Model | era 3 | RL & Games | — | Models
- creators: Julian Schrittwieser, David Silver et al. (DeepMind)
- description: Planning with a learned model, without being given the game rules. It matched AlphaZero on board games and set a new state of the art on Atari.
- capability_note: Extended self-play planning to settings where the environment dynamics are unknown. It was later applied to YouTube video compression (2022).
- edges: successor-of → alphazero
- source_url: https://arxiv.org/abs/1911.08265
- hero: no

#### 2020

**66. `scaling-laws-kaplan` — Scaling Laws for Neural Language Models**
- 2020-01-23 (arXiv) | Paper | era 5 | Foundation Models | Compute & Hardware | Algorithms & Research
- creators: Jared Kaplan, Sam McCandlish, Tom Henighan, Tom Brown, Dario Amodei et al. (OpenAI)
- description: Language model loss falls as a smooth power law in parameters, data and compute.
- capability_note: Gave labs an empirical basis for betting on scale, starting with GPT-3. DeepMind's Chinchilla (2022) later revised the optimal data-to-parameter ratio, showing Kaplan-era models were undertrained.
- edges: used-by → gpt-3; built-on → transformer
- source_url: https://arxiv.org/abs/2001.08361
- hero: no

**67. `nvidia-a100` — NVIDIA A100 (Ampere)**
- 2020-05-14 | Product | era 3 | Compute & Hardware | — | Compute & Hardware
- creators: NVIDIA
- description: A datacenter GPU with third-generation Tensor Cores, TF32/BF16 support and multi-instance GPU.
- capability_note: The standard training chip for 2021–2022 models, including most post-GPT-3 LLMs and Stable Diffusion.
- edges: successor-of → nvidia-v100
- source_url: https://www.nvidia.com/en-us/data-center/a100/
- hero: no

**68. `gpt-3` — GPT-3 (Language Models are Few-Shot Learners)**
- 2020-05-28 (arXiv); private-beta API 2020-06-11; Microsoft exclusive license 2020-09-22 | Model | era 5 | Foundation Models | Language/NLP | Models
- creators: Tom Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, Dario Amodei et al. (OpenAI)
- description: A 175B-parameter decoder Transformer trained on about 300B tokens (filtered Common Crawl, WebText2, books, Wikipedia). Offered only through an API.
- capability_note: In-context (few-shot) learning without fine-tuning: it could write, translate, and generate simple code from prompts. It also produced confident errors and failed at arithmetic and commonsense in ways later documented. Sam Altman himself said "The GPT-3 hype is way too much" (Q2). The Guardian's "A robot wrote this entire article" op-ed (Sept 2020) was edited from eight GPT-3 outputs ([Guardian](https://www.theguardian.com/commentisfree/2020/sep/08/robot-wrote-this-article-gpt-3)).
- edges: successor-of → gpt-2; built-on → scaling-laws-kaplan, transformer; uses → nvidia-v100; successor → codex
- source_url: https://arxiv.org/abs/2005.14165
- hero: yes

**69. `ddpm` — Denoising Diffusion Probabilistic Models**
- 2020-06-19 (arXiv; NeurIPS 2020) | Paper | era 4 | Generative Media | Neural Networks & Deep Learning | Algorithms & Research
- creators: Jonathan Ho, Ajay Jain, Pieter Abbeel (UC Berkeley)
- description: Generates images by learning to reverse a gradual noising process. It builds on Sohl-Dickstein et al. 2015 and Song & Ermon's score-based models (2019).
- capability_note: Matched or beat GAN sample quality (FID 3.17 on CIFAR-10) with stable training. OpenAI's "Diffusion Models Beat GANs" followed in May 2021 (arXiv 2105.05233). This is the basis of DALL·E 2, Imagen and Stable Diffusion (2022).
- edges: competes-with → gans; uses → u-net; successor → latent-diffusion
- source_url: https://arxiv.org/abs/2006.11239
- hero: no

**70. `eleutherai-gpt-neo` — EleutherAI and GPT-Neo**
- 2020-07 (EleutherAI formed on Discord); GPT-Neo 1.3B/2.7B released 2021-03-21 | Organization / Open-source repo | era 5 | Foundation Models | Language/NLP | Models
- creators: Connor Leahy, Leo Gao, Sid Black and the EleutherAI collective
- description: A volunteer grassroots collective that set out to replicate GPT-3 openly, starting with open GPT-3-style models trained on The Pile.
- capability_note: Changed who could build large language models. It showed a non-corporate group could train and release GPT-3-architecture models, though far smaller than 175B.
- edges: uses → the-pile; successor → gpt-j; competes-with → gpt-3
- source_url: https://github.com/EleutherAI/gpt-neo
- hero: no

**71. `vit` — Vision Transformer (ViT)**
- 2020-10-22 (arXiv; ICLR 2021) | Paper | era 4 | Vision | Foundation Models | Models
- creators: Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov et al. (Google Brain)
- description: A pure Transformer on 16×16 image patches.
- capability_note: Matched or beat CNNs when pretrained on very large datasets (JFT-300M). It unified the architecture across vision and language, and CLIP used it as an image encoder.
- edges: built-on → transformer; competes-with → resnet; used-by → clip
- source_url: https://arxiv.org/abs/2010.11929
- hero: no

**72. `alphafold-2` — AlphaFold 2 (CASP14)**
- 2020-11-30 (CASP14 results); Nature paper and open-source code 2021-07-15; AlphaFold DB with EMBL-EBI 2021-07-22 | Model | era 4 | Foundation Models | Neural Networks & Deep Learning | Models
- creators: John Jumper, Demis Hassabis et al. (DeepMind)
- description: An attention-based network (Evoformer plus structure module) predicting 3D protein structure from sequence and multiple sequence alignments.
- capability_note: Median GDT of 92.4 across CASP14 targets and 87.0 on the hardest free-modelling category, the first time this accuracy level was reached at CASP ([phys.org / DeepMind](https://phys.org/news/2020-11-ai-solution-year-old-protein.html)). CLAIM vs REALITY: "solving protein folding" meant predicting static single-chain structures. It did not address folding dynamics, conformational change, or (initially) complexes, and it was weaker on disordered regions. Hassabis and Jumper shared the 2024 Chemistry Nobel (post-period).
- edges: created-by → deepmind; built-on → transformer (attention)
- source_url: https://www.nature.com/articles/s41586-021-03819-2
- hero: yes

**73. `stochastic-parrots` — Gebru's ouster and "On the Dangers of Stochastic Parrots"**
- 2020-12-02 (Timnit Gebru's exit from Google); paper at FAccT, 2021-03 | Paper / Event | era 5 | Safety & Alignment | Foundation Models | Ops/Eval/Safety
- creators: Emily M. Bender, Timnit Gebru, Angelina McMillan-Major, Margaret Mitchell ("Shmargaret Shmitchell")
- description: A critique of ever-larger language models covering environmental cost, undocumented training data, encoded bias, and the illusion of meaning.
- capability_note: The defining critical counter-narrative to scale. Google's handling of the paper led to the departures of Gebru and Mitchell.
- edges: critiques → gpt-3, bert
- source_url: https://dl.acm.org/doi/10.1145/3442188.3445922
- hero: no

**74. `the-pile` — The Pile**
- 2020-12-31 (arXiv) | Open-source repo (dataset) | era 5 | Foundation Models | Language/NLP | Data
- creators: Leo Gao, Stella Biderman et al. (EleutherAI)
- description: An 825 GiB open English text corpus built from 22 sources, including Pile-CC (Common Crawl), PubMed, arXiv, GitHub, Books3 and others.
- capability_note: The first widely used open, documented LLM pretraining dataset (GPT-Neo, GPT-J, and later Pythia). Its Books3 subset was later at the center of copyright disputes (post-2021).
- edges: used-by → eleutherai-gpt-neo, gpt-j; related → t5-c4
- source_url: https://arxiv.org/abs/2101.00027
- hero: no

#### 2021

**75. `dall-e-1` — DALL·E (v1)**
- 2021-01-05 (blog); paper 2021-02-24 | Model | era 4 | Generative Media | Foundation Models | Models
- creators: Aditya Ramesh, Mikhail Pavlov, Gabriel Goh, Scott Gray et al. (OpenAI)
- description: A 12B-parameter autoregressive Transformer over text and discrete VAE image tokens, generating images from captions ("an armchair in the shape of an avocado").
- capability_note: Showed compositional text-to-image generation. Outputs were low resolution (256×256), results were cherry-picked with CLIP reranking, and the model was not publicly released. DALL·E 2 (2022, diffusion) superseded it.
- edges: built-on → gpt-3 (architecture), transformer; uses → clip (reranking); successor → dall-e-2 (post-2021)
- source_url: https://openai.com/index/dall-e/ (paper: https://arxiv.org/abs/2102.12092)
- hero: yes

**76. `clip` — CLIP (Contrastive Language-Image Pre-training)**
- 2021-01-05 (blog); paper 2021-02-26; weights for smaller models released | Model / Open-source repo | era 4 | Vision | Foundation Models; Language/NLP | Models
- creators: Alec Radford, Jong Wook Kim et al. (OpenAI)
- description: Jointly trained image and text encoders on 400M web image-text pairs using a contrastive objective.
- capability_note: Its zero-shot ImageNet accuracy matched a supervised ResNet-50. CLIP became the text-image bridge for VQGAN+CLIP art (2021), DALL·E 2 and Stable Diffusion. The paper documents failures on typographic attacks and biases.
- edges: uses → vit, transformer; used-by → dall-e-1, latent-diffusion
- source_url: https://arxiv.org/abs/2103.00020
- hero: no

**77. `switch-transformer` — Switch Transformer**
- 2021-01-11 (arXiv) | Paper | era 5 | Foundation Models | Compute & Hardware | Models
- creators: William Fedus, Barret Zoph, Noam Shazeer (Google)
- description: A sparse Mixture-of-Experts Transformer that scaled to 1.6 trillion parameters with constant compute per token.
- capability_note: CLAIM vs REALITY: parameter-count headlines (see also China's Wu Dao 2.0 at 1.75T in June 2021) were not comparable to dense models. Sparse parameters are not equivalent to GPT-3's dense 175B.
- edges: built-on → transformer; competes-with → gpt-3
- source_url: https://arxiv.org/abs/2101.03961
- hero: no

**78. `lamda` — LaMDA**
- 2021-05-18 (announced at Google I/O); paper Jan 2022 | Model | era 5 | Foundation Models | Language/NLP | Models
- creators: Google (Eli Collins, Zoubin Ghahramani, blog authors)
- description: A dialogue-tuned Transformer language model, demoed at I/O talking as Pluto and as a paper airplane.
- capability_note: Kept internal and not released in 2021. It became notorious in June 2022, when engineer Blake Lemoine claimed it was sentient, a claim Google rejected. It later underpinned Bard (2023).
- edges: built-on → transformer; competes-with → gpt-3
- source_url: https://blog.google/technology/ai/lamda/
- hero: no

**79. `gpt-j` — GPT-J-6B**
- 2021-06-09 (approx.; release) | Open-source repo / Model | era 5 | Foundation Models | Local Runtimes & Inference | Models
- creators: Ben Wang, Aran Komatsuzaki (EleutherAI)
- description: A 6B-parameter open GPT-3-style model trained on The Pile with JAX on TPUs (via TRC).
- capability_note: In 2021 it was the strongest openly downloadable GPT-3-style model, roughly on par with GPT-3 Curie (6.7B) on many zero-shot tasks by EleutherAI's evaluation. It was fine-tuned widely by the community.
- edges: successor-of → eleutherai-gpt-neo; uses → jax, the-pile; competes-with → gpt-3
- source_url: https://github.com/kingoflolz/mesh-transformer-jax
- hero: no

**80. `github-copilot` — GitHub Copilot (technical preview)**
- 2021-06-29 | Product | era 5 | Coding Agents & Harnesses | Foundation Models | Apps & Products
- creators: GitHub + OpenAI (Nat Friedman announced)
- description: An AI pair programmer in VS Code that autocompleted lines and whole functions, powered by Codex.
- capability_note: The first mass-market LLM product for developers. Suggestions were often wrong or insecure; a 2021 NYU study found about 40% of generated programs in security-relevant scenarios were vulnerable (Pearce et al., arXiv 2108.09293). It raised licensing and copyright disputes over training on public code. General availability came June 2022.
- edges: uses → codex; created-by → github (acquired-by Microsoft 2018)
- source_url: https://github.blog/2021-06-29-introducing-github-copilot-ai-pair-programmer/
- hero: yes

**81. `codex` — Codex (Evaluating LLMs Trained on Code)**
- 2021-07-07 (paper); OpenAI Codex API private beta 2021-08-10 | Model / Paper | era 5 | Coding Agents & Harnesses | Foundation Models; LLMOps & Eval | Models
- creators: Mark Chen, Jerry Tworek, Heewoo Jun, Wojciech Zaremba et al. (OpenAI)
- description: GPT-3 fine-tuned on public GitHub code, introducing the HumanEval benchmark.
- capability_note: The 12B Codex solved 28.8% of HumanEval problems with one sample and 70.2% with 100 samples plus unit-test selection. It was capable but unreliable, and the paper lists limitations such as struggling with long chains of operations.
- edges: successor-of → gpt-3; used-by → github-copilot
- source_url: https://arxiv.org/abs/2107.03374
- hero: no

**82. `anthropic-founded` — Anthropic founded**
- 2021 (founded early 2021; $124M Series A announced 2021-05-28) | Organization | era 5 | Safety & Alignment | Foundation Models | Algorithms & Research
- creators: Dario Amodei, Daniela Amodei, Tom Brown, Chris Olah, Sam McCandlish, Jack Clark, Jared Kaplan and others (many ex-OpenAI)
- description: An AI safety company focused on "reliable, interpretable, and steerable" large-scale AI systems.
- capability_note: No products in 2021. Its founders included authors of GPT-3, the scaling laws paper and RLHF.
- edges: related → openai-founded, scaling-laws-kaplan, rlhf-christiano
- source_url: https://www.anthropic.com/news/anthropic-raises-124-million-to-build-more-reliable-general-ai-systems
- hero: no

**83. `latent-diffusion` — Latent Diffusion Models (precursor to Stable Diffusion)**
- 2021-12-20 (arXiv; CVPR 2022) | Paper / Open-source repo | era 4 | Generative Media | Foundation Models | Models
- creators: Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, Björn Ommer (LMU Munich / Heidelberg; Runway)
- description: Runs diffusion in a compressed autoencoder latent space, with cross-attention conditioning on text.
- capability_note: Cut the compute needed for high-resolution text-to-image generation enough to run on consumer GPUs. Stable Diffusion (Aug 2022, with Stability AI) built directly on it.
- edges: successor-of → ddpm; uses → u-net, clip (text encoder in SD); successor → stable-diffusion (post-2021)
- source_url: https://arxiv.org/abs/2112.10752
- hero: no

### Inferences
- The "demonstrated vs claimed" gap follows a repeating pattern. A narrow benchmark or controlled setting (ImageNet single-annotator baseline, Switchboard, GLUE, restricted Dota hero pool, Stockfish settings, Kociemba-assisted Rubik's cube, staged Duplex demo) gets reported as general human-level capability. Good candidates for a Claim-vs-Reality tag: entries 16, 18, 28, 32, 34, 43, 49, 51, 56, 57, 62, 68, 72, 77.
- Access widened in four steps: frameworks (Caffe → TensorFlow/Keras → PyTorch → JAX), free compute (Colab), model hubs (Hugging Face), then open replications (EleutherAI, The Pile, GPT-J). Hardware stayed concentrated in NVIDIA and Google TPUs.
- The Transformer (2017) is the single hub node. Most 2018–2021 entries have a built-on edge to it.
- Era mapping used: vision, speech and generative images are era 4; language and code generation are era 5; algorithms, RL, frameworks and hardware are era 3. The editor may prefer era 5 for GPT-1/BERT (understanding rather than writing). I kept them at 5 as the start of the LM lineage.
- Suggested hero moments: AlexNet, DQN, AlphaGo/Move 37, Transformer, BERT, GPT-2 staged release, GPT-3, AlphaFold 2, DALL·E, Copilot, plus Watson Health, Duplex and self-driving as "anti-hero" hype moments.

### Gaps
- Several URLs were given from canonical patterns without being fetched this session and are marked "(verify)": the TechCrunch DeepMind acquisition piece, the Vice deepfakes article, the NTSB Uber page, OpenAI LP and Microsoft 2019 announcements, and the Colab launch date. The DeepMind acquisition price varies by outlet.
- The exact GPT-J release day (June 2021) and the Colab public launch date (2017 vs 2018) need confirmation.
- "No strong evidence of misuse" in OpenAI's Nov 2019 GPT-2 1.5B post is from memory. The OpenAI site returned HTTP 403 to fetches, so it could not be verified verbatim.
- Sophia's first-activation date (commonly cited as Feb 14, 2016) was not confirmed against a primary source.
- The Epoch AI notable-models database was not queried for compute and parameter figures.
- The Common Crawl foundation (2007) predates the window, so it is covered here through C4 (entry 63) and The Pile (entry 74) rather than as its own entry.

---

## Q2. Verbatim hype quotes from named people (2012–2021) and what happened afterwards

### Takeaway
The best-documented hype quotes are about radiology replacement, self-driving timelines, and healthcare AI (IBM Watson). In each case the predicted capability or deadline had not arrived by 2021, and in most cases still had not years later. Two quotes are useful counterweights from insiders: LeCun on Sophia, and Altman on GPT-3.

### Cited Findings

**Geoffrey Hinton on radiologists (2016, Creative Destruction Lab event, Toronto)**
- Quote: "I think if you work as a radiologist, you are like the coyote that's already over the edge of the cliff but hasn't yet looked down." Also: "People should stop training radiologists now. It's just completely obvious within five years deep learning is going to do better than radiologists …. It might be 10 years, but we've got plenty of radiologists already." — [The New Republic](https://newrepublic.com/article/187203/ai-radiology-geoffrey-hinton-nobel-prediction); also quoted by [Melanie Mitchell on X](https://x.com/MelMitchell1/status/1761488455228612838?lang=en); NYT revisit summarized by [Radiology Business](https://radiologybusiness.com/topics/artificial-intelligence/ny-times-revisits-nobel-prize-winners-prediction-ai-will-render-radiologists-obsolete)
- What happened: the number of US radiologists rose about 7% between 2015 and 2019, and the field now reports a shortage — [The New Republic](https://newrepublic.com/article/187203/ai-radiology-geoffrey-hinton-nobel-prediction). In 2026 Fortune reported radiologist salaries up to $571K and demand growing fast — [Fortune, 2026-05-04](https://fortune.com/2026/05/04/godfather-of-ai-geoffrey-hinton-radiologists-future-of-work-tech-ai-job-anxiety/). See also [Quartz 2021, "AI promised to revolutionize radiology but so far it's failing"](https://qz.com/2016153/ai-promised-to-revolutionize-radiology-but-so-far-its-failing).

**Elon Musk on full self-driving (multiple years)**
- Dec 2015 (Fortune): "We're going to end up with complete autonomy, and I think we will have complete autonomy in approximately two years." — via [Wikipedia list citing fortune.com/2015/12/21/elon-musk-interview/](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk)
- Jan 2016 (The Verge): "I think that within two years, you'll be able to summon your car from across the country." — [Wikipedia list citing The Verge](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk)
- June 2016 (Time): "I consider autonomous driving to be a basically solved problem. We're less than two years away from complete autonomy." — [Wikipedia list citing time.com/4354864](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk)
- Oct 2016: promised a fully autonomous LA-to-New York drive by end of 2017 "without the need for a single touch." — [Wikipedia list citing The Verge 2016-10-19](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk)
- Apr 22, 2019 (Tesla Autonomy Day): "If you fast forward a year, maybe a year and three months, but next year for sure, we'll have over a million robotaxis on the road." — [CNBC](https://www.cnbc.com/2019/04/22/elon-musk-says-tesla-robotaxis-will-hit-the-market-next-year.html)
- Jan 2021 (Q4 2020 earnings call): "I'm highly confident the car will drive itself for the reliability in excess of a human this year." — [Wikipedia list citing Motley Fool transcript](https://en.wikipedia.org/wiki/List_of_predictions_for_autonomous_Tesla_vehicles_by_Elon_Musk)
- What happened: no coast-to-coast autonomous drive happened, and no Tesla robotaxis existed by end-2020 — [The Drive](https://www.thedrive.com/news/38129/elon-musk-promised-1-million-tesla-robotaxis-by-the-end-of-2020-where-are-they); [Fast Company](https://www.fastcompany.com/90677822/elon-musks-tesla-robotaxi-promise-typifies-self-driving-overexuberance). A Sept 2026 Motley Fool piece says none of the "over a million robotaxis" materialized and a dedicated robotaxi fleet is not expected until at least 2027 — [Motley Fool, 2026-09-16](https://www.fool.com/investing/2026/09/16/elon-musk-promised-over-a-million-robotaxis-by-202/).

**Ford on autonomous ride-hailing (Aug 16, 2016)**
- Statement (company press release, not a named individual): Ford intends "to have a high-volume, fully autonomous SAE level 4-capable vehicle in commercial operation in 2021 in a ride-hailing or ride-sharing service." — [Ford news release PDF](https://s205.q4cdn.com/882619693/files/doc_presentation/doc_events/2016/08/16/news-release-august-16-2016-av.pdf); [CNBC](https://www.cnbc.com/2016/08/16/ford-will-have-a-fully-autonomous-vehicle-on-the-streets-in-less-than-five-years.html). Then-CEO Mark Fields led the announcement; for a named quote from him, use the [briefing transcript](https://s205.q4cdn.com/882619693/files/doc_presentation/doc_events/2016/08/16/ford-smart-mobility-briefing-aug-16-final-transcript.pdf) (not extracted this session).
- What happened: no Ford L4 ride-hail service launched in 2021. Ford and VW later shut down their joint self-driving unit Argo AI in Oct 2022. That shutdown is from background knowledge and was not verified with a URL this session (see Gaps).

**IBM / Ginni Rometty on Watson Health**
- Quote attributed to Rometty: "I'm telling you, our moonshot will be the impact we will have on health care... We will change and do our part to change the face of health care." — secondhand, via an academic case study ([AIS eLibrary, CAIS](https://aisel.aisnet.org/cgi/viewcontent.cgi?article=4731&context=cais)). Verify against the original speech before publishing.
- IBM's Oct 2013 press release said MD Anderson "is using the IBM Watson cognitive computing system for its mission to eradicate cancer." — quoted in [VentureBeat 2013](https://venturebeat.com/2013/10/18/ibm-watson-fires-its-own-cancer-fighting-moonshot/) and the CAIS case study (verify exact wording against the IBM release).
- What happened: STAT (Sept 2017) found Watson for Oncology was adopted by only a few dozen hospitals and was "artificially intelligent only in the most rudimentary sense" (STAT's characterization) — [STAT](https://www.statnews.com/2017/09/05/watson-ibm-cancer/). Internal documents showed "unsafe and incorrect" recommendations and "often inaccurate" advice raising "serious questions about the process for building content and the underlying technology" — [STAT, July 2018](https://www.statnews.com/2018/07/25/ibm-watson-recommended-unsafe-incorrect-treatments/). MD Anderson benched the project — [Forbes 2017](https://www.forbes.com/sites/matthewherper/2017/02/19/md-anderson-benches-ibm-watson-in-setback-for-artificial-intelligence-in-medicine/). Assets were sold to Francisco Partners on Jan 21, 2022 (reported ~$1B) — [IBM newsroom](https://newsroom.ibm.com/2022-01-21-Francisco-Partners-to-Acquire-IBMs-Healthcare-Data-and-Analytics-Assets); [Healthcare IT News](https://www.healthcareitnews.com/news/ibm-sell-watson-health-assets-francisco-partners). Overview: [IEEE Spectrum](https://spectrum.ieee.org/how-ibm-watson-overpromised-and-underdelivered-on-ai-health-care); [Slate 2022](https://slate.com/technology/2022/01/ibm-watson-health-failure-artificial-intelligence.html).

**Andrew Ng's "one-second rule" (Harvard Business Review, Nov 2016)**
- Quote (widely reproduced): "If a typical person can do a mental task with less than one second of thought, we can probably automate it using AI either now or in the near future." — [HBR, "What Artificial Intelligence Can and Can't Do Right Now"](https://hbr.org/2016/11/what-artificial-intelligence-can-and-cant-do-right-now). Note: the search snippet paraphrased it as "If a task takes you less than one second of thought, a machine can probably do it." Check the exact wording against the HBR text.
- What happened: a useful heuristic, not a hype claim as such, but many "one-second" perception tasks stayed unsolved in deployment by 2021: robust driving perception (entries 34 and 47) and demographically fair face analysis (entry 46).

**OpenAI on withholding GPT-2 (Feb 14, 2019)**
- Quote: "Due to our concerns about malicious applications of the technology, we are not releasing the trained model." — quoted by [Rani Horev on X](https://x.com/rani_horev/status/1096097836326780934) and [Naoki Shibuya's summary](https://naokishibuya.github.io/blog/2022-12-30-gpt-2-2019/). Original: OpenAI blog "Better Language Models and Their Implications" (openai.com/index/better-language-models/, 403 to automated fetch).
- What happened: headlines like ScienceAlert's "Scientists Developed an AI So Advanced They Say It's Too Dangerous to Release" amplified the story — [ScienceAlert](https://www.sciencealert.com/scientists-developed-an-ai-so-advanced-they-say-it-s-too-dangerous-to-release). fast.ai's Jeremy Howard and others criticized the approach — [fast.ai](https://www.fast.ai/posts/2019-02-15-openai-gp2.html). The full 1.5B model was released about nine months later, in Nov 2019 — [Shibuya summary](https://naokishibuya.github.io/blog/2022-12-30-gpt-2-2019/).

**Sam Altman on GPT-3 (July 19, 2020), insider counter-hype**
- Quote: "The GPT-3 hype is way too much. It's impressive (thanks for the nice compliments!) but it still has serious weaknesses and sometimes makes very silly mistakes. AI is going to change the world, but GPT-3 is just a very early glimpse. We have a lot still to figure out." — [Sam Altman on X](https://twitter.com/sama/status/1284922296348454913); [Hacker News](https://news.ycombinator.com/item?id=23891648)
- What happened: GPT-3 stayed API-only, and its errors (fabrication, arithmetic) were widely documented. It led to Codex and Copilot in 2021 (entries 80–81).

**Yann LeCun on Sophia (Jan 4, 2018)**
- Quotes: called Sophia "complete bullsh*t" and "Potemkin AI"/"Cargo Cult AI." Later: "More BS from the (human) puppeteers behind Sophia" and "many people are being deceived into thinking that this (mechanically sophisticated) animatronic puppet is intelligent. It's not. It has no feeling, no opinions, and zero understanding of what it says." — reported by [Gearbrain](https://www.gearbrain.com/sopha-the-robot-artificial-intelligence-2526789206.html); [Daniel Estrada, Medium](https://medium.com/@eripsa/sophia-and-her-critics-5bd22d859b9c); summary at [Skynet Today](https://www.skynettoday.com/briefs/sophia)
- Context: Saudi Arabia had granted Sophia "citizenship" in Oct 2017 — [Skynet Today](https://www.skynettoday.com/briefs/sophia).

**Peter Lee (Microsoft Research) on Tay (Mar 25, 2016)**
- Quote: "We are deeply sorry for the unintended offensive and hurtful tweets from Tay"; the team had made "a critical oversight for this specific attack." — [Official Microsoft Blog](https://blogs.microsoft.com/blog/2016/03/25/learning-tays-introduction/)

**Google Duplex (May 2018 demo), outcome data rather than a quote**
- What happened: Google told the NYT in May 2019 that about 25% of Duplex calls started with a human in a call center and about 15% had human intervention. In NYT tests, humans completed three of four successful bookings — [Engadget](https://www.engadget.com/2019-05-22-google-duplex-is-made-of-people.html); [Android Police](https://www.androidpolice.com/2019/05/23/25-percent-of-google-duplex-calls-are-actually-conducted-by-humans/); [Forbes](https://www.forbes.com/sites/johanmoreno/2019/05/28/25-of-google-duplex-calls-are-placed-by-humans-but-likely-not-for-long/)

### Inferences
- The strongest Claim-vs-Reality pairs for the dataset are Hinton on radiologists, the Musk timeline sequence, and IBM Watson for Oncology. Each has a dated verbatim claim and a well-sourced outcome.
- Many of the decade's "too good to be true" moments were revealed by the builders themselves (Altman, OpenAI's Rubik's cube caveats, DeepMind's AlphaStar revisions) or by peer researchers (LeCun, Gebru and Buolamwini). Few came from regulators.

### Gaps
- No verbatim Sundar Pichai or Google quote from the Duplex I/O keynote was extracted. The Duplex entry relies on outcome data.
- No verbatim Mark Fields (Ford) quote was extracted. The 2016 claim is in the company's own press-release voice.
- The Rometty "moonshot" quote and the MD Anderson "eradicate cancer" phrasing are secondhand (academic case study, VentureBeat). Confirm against primary sources.
- The Argo AI shutdown (Oct 2022), as the Ford aftermath, was not sourced this session.
- The Andrew Ng HBR wording has minor variation across secondary sources. Check against HBR's text.
- Other candidate quotes not researched for lack of budget: Zuckerberg on AI chatbots (2016 F8), Ray Kurzweil's 2029 AGI prediction restated in this period, Hassabis's 2020 "solved" framing for AlphaFold, and Wu Dao 2.0 "1.75 trillion parameters" coverage.
