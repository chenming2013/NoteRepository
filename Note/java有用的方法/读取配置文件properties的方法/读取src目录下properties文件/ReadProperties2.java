package com.web1.servletContext;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 这个类专门用来读取src目录下的资源文件
 * @author Lenovo
 *
 */
public class ReadProperties2 extends HttpServlet
{
	private InputStream inputStream;

	@Override
	protected void doPost(HttpServletRequest req,HttpServletResponse resp)
			throws ServletException, IOException
	{
		inputStream = this.getClass().getResourceAsStream("/DBInfo.properties"); //注意: 这里文件路径必须要有一个/
		Properties pp = new Properties();
		
		//将文件输入流加载到Properties中
		pp.load(inputStream);
		
		String user = pp.getProperty("user");
		String password = pp.getProperty("password");
		System.out.println("user: "+user);
		System.out.println("password: "+password);
	}
	
	@Override
	protected void doGet(javax.servlet.http.HttpServletRequest req,
			javax.servlet.http.HttpServletResponse resp)
			throws javax.servlet.ServletException, java.io.IOException
	{
		this.doPost(req, resp);
	}
}
