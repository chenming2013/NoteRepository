public static void showResultByPage(int pageSize)    //pageSize:ÿһҳ�����ʾ��������
	{
		int pageNow = 1;  //��ǰҳ
		int rowCount = 1;  //��������
		int pageCount = 1;  //ÿһҳʵ����ʾ���������������Ҫ��ѯ
		
		Session session = null;
		Transaction transaction = null;
		
		try{
			
			//��ȡ�����ݿ����ӵĻỰSession
			session = MySessionFactory.getSessionFactory().getCurrentSession();
			
			//����ʼ
			transaction = session.beginTransaction();
			
			rowCount = Integer.parseInt(session.createQuery("select count(*) from Student").uniqueResult().toString());
			pageCount = (rowCount-1)/pageSize + 1;
			for(int i=1;i<=pageCount;i++)
			{
				System.out.println("*****************��"+i+"ҳ*******************");
				List<Student> list = session.createQuery("from Student").setFirstResult((i-1)*pageSize).setMaxResults(pageSize).list();
				for(Student student:list)
				{
					System.out.println(student.getSname()+","+student.getSdept());
				}
			}
			
			//�����ύ
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