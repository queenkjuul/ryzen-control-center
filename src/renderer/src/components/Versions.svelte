<script lang="ts">
  const versions = window.api.versions
</script>

<ul class="versions">
  <li class="electron-version">Electron v{versions.electron}</li>
  <li class="chrome-version">Chromium v{versions.chrome}</li>
  <li class="node-version">Node v{versions.node}</li>
</ul>
