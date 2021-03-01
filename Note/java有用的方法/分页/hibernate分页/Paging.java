public static void showResultByPage(int pageSize)    //pageSize:每一页最大显示的数据量
	{
		int pageNow = 1;  //当前页
		int rowCount = 1;  //数据总量
		int pageCount = 1;  //每一页实际显示的数据量，这个需要查询
		
		Session session = null;
		Transaction transaction = null;
		
		try{
			
			//获取与数据库连接的会话Session
			session = MySessionFactory.getSessionFactory().getCurrentSession();
			
			//事务开始
			transaction = session.beginTransaction();
			
			rowCount = Integer.parseInt(session.createQuery("select count(*) from Student").uniqueResult().toString());
			pageCount = (rowCount-1)/pageSize + 1;
			for(int i=1;i<=pageCount;i++)
			{
				System.out.println("*****************第"+i+"页*******************");
				List<Student> list = session.createQuery("from Student").setFirstResult((i-1)*pageSize).setMaxResults(pageSize).list();
				for(Student student:list)
				{
					System.out.println(student.getSname()+","+student.getSdept());
				}
			}
			
			//事务提交
			transaction.commit();
		
		}catch(Exception e)
		{
			if(transaction!=null)
			{
				transaction.rollback();
			}
			e.printStackTrace();
		}finally
		{
			if(session!=null && session.isOpen())
			{
				session.close();
			}
		}
	}