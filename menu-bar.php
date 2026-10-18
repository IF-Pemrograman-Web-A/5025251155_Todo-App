<nav class="menu-bar" aria-label="Menu utama">
  <ul>
    <li><a href="index.php?menu=personal"<?= $menu === "personal" ? ' aria-current="page"' : "" ?>>Personal</a></li>
    <li><a href="index.php?menu=shared"<?= $menu === "shared" ? ' aria-current="page"' : "" ?>>Shared</a></li>
  </ul>
</nav>