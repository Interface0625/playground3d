Render{
	gl: null,
	shaders_vs: [],
	shaders_fs: [],

	current_texture: null,
	current_shader_vs: null,
	current_shader_fs: null,

	viewMatrix: null,

	init: function(gl){},

	draw_point2d: function(p, shape, color, size),
	draw_line2d: function(p1, p2, color, size){},
	draw_triangles2d: function(pointlist, colorlist){}{},
	draw_quad2d: function(position, size, texture){},

	draw_point: function(p, shape, color, size){},
	draw_line: function(p1, p2, color, size){},

	draw_arrays_color: function(positions, colors){},
	draw_arrays_texture: function(positions, textureUVs){},

	// By Buffers:
	draw_VertexColorBuffer: function(positions, colors, indices){},
	draw_VertexTextureBuffer: function(positions, textureUVs, indices){},
	
	draw_VertexTextureNormalBuffer: function(positions, normals, textureUVs, indices){}

}