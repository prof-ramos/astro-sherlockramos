// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "SherlockRamos - Blog";
export const SITE_DESCRIPTION = "Blog pessoal de Gabriel Ramos";

// Type-safe profile configuration
export interface SocialLink {
	name: string;
	url: string;
	icon: 'github' | 'linkedin' | 'twitter' | 'email';
}

export interface ProfileConfig {
	name: string;
	title: string;
	subtitle: string;
	description: string;
	avatar: string;
	social: SocialLink[];
}

export const PROFILE: ProfileConfig = {
	name: "Bem-vindo!",
	title: "Poeta, seresteiro, cantor e mentiroso",
	subtitle: "",
	description: "Bem-vindo ao meu blog sobre tecnologia, programação e reflexões. Aqui compartilho conhecimentos, experiências e aprendizados.",
	avatar: "https://pbs.twimg.com/profile_images/1975318443646709760/Ve9wMLwI_400x400.jpg",
	social: [
		{ name: "Twitter", url: "https://twitter.com/GatoMaconhado_", icon: "twitter" },
	]
};
