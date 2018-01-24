<header class="site-header">
  <div class="site-header__container">
    <h1 class="site-header__brand">
      <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-header__brand-link">
        <?php include(__DIR__ ."/../svgs/logo.svg"); ?>
        <span class="site-header__tagline site-header__tagline--large">
          30 Years of <br>
          California <br>
          Contemporary <br>
          Architecture
        </span>
        <span class="site-header__tagline site-header__tagline--small">
          <span class="site-header__tagline-number">30</span>
          <span class="site-header__tagline-year">Years</span>
        </span>
      </a>
    </h1>
    <div class="site-header__utility-links">
      <a href="#" class="site-header__book-cta">
        <span>Get the book</span>
        <?php include(__DIR__ ."/../svgs/book.svg"); ?>
      </a>
      <button class="site-header__menu-btn">
        <?php include(__DIR__ ."/../svgs/hamburger.svg"); ?>
      </button>
    </div>
  </div>
</header>

<?php include("site-nav.php"); ?>
