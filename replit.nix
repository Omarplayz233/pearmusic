{ pkgs }: {
	deps = [
		pkgs.python39Full
  pkgs.nodejs_20
  pkgs.python3
		pkgs.nodePackages.typescript-language-server
		pkgs.yarn
		pkgs.wget
	];
}